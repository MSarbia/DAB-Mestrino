using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ServiceModel;
using WindchillDocConnectorLibrary.WindchillDocService;
using System.Drawing;
using System.Drawing.Imaging;
using System.Web;
using System.Net;
using System.Net.Http;
using System.Configuration;

namespace WindchillDocConnectorLibrary
{
    public class WindchillDocConnector : IDisposable
    {
        private ExtClient _docClient;

        private string _userName = "wcadmin";
        private string _password = "DWTadmin";

        public WindchillDocConnector()
        {
            _docClient = new ExtClient("ExtPort");
            ExeConfigurationFileMap map = new ExeConfigurationFileMap();
            map.ExeConfigFilename = "WindchillDocConnectorLibrary.dll.config";

            Configuration libConfig = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);

            AppSettingsSection section = (libConfig.GetSection("appSettings") as AppSettingsSection);

            _userName = section.Settings["WindchillUser"].Value;
            _password = section.Settings["WindchillPassword"].Value;
            //_docClient.ClientCredentials.UseIdentityConfiguration = true;
            //_docClient.ClientCredentials.UserName.UserName = "wcadmin";
            //_docClient.ClientCredentials.UserName.Password = "DWTadmin";


            //var binding = _docClient.Endpoint.Binding as BasicHttpBinding;
            //if (binding == null)
            //{
            //    System.Diagnostics.Debug.WriteLine("Binding of this endpoint is not BasicHttpBinding");
            //    return;
            //}

            //binding.Security.Mode = BasicHttpSecurityMode.TransportCredentialOnly;
            //binding.UseDefaultWebProxy = true;
            //binding.Security.Transport.ClientCredentialType = HttpClientCredentialType.Basic; // !!!
            //binding.Security.Transport.ProxyCredentialType = HttpProxyCredentialType.Basic; // !!!



            if (_docClient.ClientCredentials == null)
            {
                System.Diagnostics.Debug.WriteLine("Null ClientCredentials");
                return;
            }
            _docClient.ClientCredentials.UserName.UserName = _userName;
            _docClient.ClientCredentials.UserName.Password = _password;
        }

        public List<WindchillDocInfo> GetDocumentList(string productCode, string productRevision)
        {
            var docInfoList = new List<WindchillDocInfo>();
            var docList = GetDocuments(productCode, productRevision);
            var docsToDownload = GetDocsToDownload(docList);
            foreach (var doc in docsToDownload)
            {
                var contentRoles = XMLConfigParse.getContentRoleTypes(doc.softType);
                foreach (var contenRole in contentRoles.Keys)
                {
                    docInfoList.Add(new WindchillDocInfo
                    {
                        SoftType = doc.softType,
                        Number = doc.number,
                        Revision = doc.revision,
                        ContentRole = contenRole,
                        DocType = contentRoles[contenRole]
                    });
                }
            }
            return docInfoList;
        }

        private List<wsRevisionControlled> GetDocsToDownload(List<wsRevisionControlled> docList)
        {
            List<wsRevisionControlled> docListFiltered = new List<wsRevisionControlled>();
            List<string> softtypes = XMLConfigParse.getSoftTypes();
            foreach (wsRevisionControlled doc in docList)
            {
                if (softtypes.Contains(doc.softType))
                {
                    docListFiltered.Add(doc);
                }
            }
            return docListFiltered;
        }

        private List<wsRevisionControlled> GetDocuments(string productCode, string productRevision)
        {
            List<wsRevisionControlled> docList = new List<wsRevisionControlled>();
            string viewType = "MANUFACTURING";
            //string viewType = "Engineering";
            try
            {
                var files = _docClient.getRelatedDocuments(productCode, productRevision, viewType);
                foreach (var file in files)
                {
                    docList.Add(file);
                }
            }
            catch (System.Exception)
            {
            }
            return docList;
        }
        
        private byte[] GetAttachmentData(byte[] data, byte[] boundary1, byte[] boundary2)
        {
            if (data == null || boundary1 == null || boundary2 == null)
                return null;

            if (boundary1.LongLength > data.LongLength)
                return null;

            long i, j, startIndex;
            bool match;
            int boundary1Pos = 0;
            for (i = 0; i < data.LongLength; i++)
            {
                startIndex = i;
                match = true;
                for (j = 0; j < boundary1.LongLength; j++)
                {
                    if (data[startIndex] != boundary1[j])
                    {
                        match = false;
                        break;
                    }
                    else if (startIndex < data.LongLength)
                    {
                        startIndex++;
                    }
                }

                if (match)
                {
                    boundary1Pos = Convert.ToInt32(startIndex - boundary1.LongLength);
                }

            }
            int pos1 = boundary1Pos + boundary1.Length;
            int pos2 = data.Length - boundary2.Length;
            int length = pos2 - pos1;

            try
            {
                byte[] output = new byte[length];
                Array.Copy(data, pos1, output, 0, length);
                return output;
            }
            catch { }
            return null;
        }


        public WindchillDoc DownloadDoc(WindchillDocInfo docInfo)
        {
            var request = (HttpWebRequest)WebRequest.Create(_docClient.Endpoint.Address.Uri);
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
            request.Method = WebRequestMethods.Http.Post;
            request.Method = "POST";
            request.ContentType = "text/xml; charset=utf-8";
            request.Headers.Add("SOAPAction", "\"http://ws.cdm.ext/Ext/downloadRequest\"");
            request.Headers.Add(HttpRequestHeader.AcceptEncoding, "gzip, deflate");

            ///WorkAround
            docInfo.SoftType = "wt.doc.WTDocument";
            ///

            string revision = string.IsNullOrEmpty(docInfo.Revision) ? string.Empty: $@"<revision xmlns="""">{ docInfo.Revision}</revision>";
            string dataString = $@"<s:Envelope xmlns:s=""http://schemas.xmlsoap.org/soap/envelope/""><s:Body xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema""><download xmlns=""http://ws.cdm.ext/""><fullClassName xmlns="""">{docInfo.SoftType}</fullClassName><number xmlns="""">{docInfo.Number}</number>{revision}<ContentRoleType xmlns="""">{docInfo.ContentRole}</ContentRoleType></download></s:Body></s:Envelope>";
            var data = Encoding.ASCII.GetBytes(dataString);
            request.ContentLength = data.Length;
            using (var stream = request.GetRequestStream())
            {
                stream.Write(data, 0, data.Length);
            }
            NetworkCredential networkCredential = new NetworkCredential(_userName, _password); // logon in format "domain\username"
            CredentialCache myCredentialCache = new CredentialCache { { _docClient.Endpoint.Address.Uri, "Basic", networkCredential } };
            request.PreAuthenticate = true;
            request.Credentials = myCredentialCache;
            using (var response = request.GetResponse())
            {
                //"Content-Type: multipart/related; type="text / xml"; boundary="uuid: fa2e8e61 - 5243 - 4a9f - bf99 - 124bbe099db1"
                string contentType = response.Headers[HttpResponseHeader.ContentType];
                if (!contentType.StartsWith("multipart/related"))
                {
                    return null;
                }

                string boundaryHeader = "boundary=\"";
                int boundaryIndex = contentType.IndexOf(boundaryHeader) + boundaryHeader.Length;
                string boundaryString = "\r\n--" + contentType.Substring(boundaryIndex, (contentType.Length - boundaryIndex - 1)) + "-- ";
                byte[] boundary1 = Encoding.UTF8.GetBytes("Content-Transfer-Encoding: binary\r\n\r\n");
                byte[] boundary2 = Encoding.UTF8.GetBytes(boundaryString);

                var responseStream = response.GetResponseStream();
                byte[] buffer = new byte[16 * 1024];
                MemoryStream ms = new MemoryStream();
                int read = 0;
                while ((read = responseStream.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                byte[] responseBytes = ms.ToArray();
                byte[] file = GetAttachmentData(responseBytes, boundary1, boundary2);
                return new WindchillDoc
                {
                    Name = docInfo.Number,
                    Revision = docInfo.Revision,
                    Content = file
                };
            }
        }

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    ((IDisposable)_docClient).Dispose();
                }

                // TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
                // TODO: set large fields to null.

                disposedValue = true;
            }
        }

        // TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
        // ~WindchillDocConnector() {
        //   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
        //   Dispose(false);
        // }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
            // TODO: uncomment the following line if the finalizer is overridden above.
            // GC.SuppressFinalize(this);
        }
        #endregion
    }
}
