using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ServiceModel;
using WindchillDocConnectorLibrary.WindchillDocService;

namespace WindchillDocConnectorLibrary
{
    public class WindchillDocConnector : IDisposable
    {
        private ExtClient _docClient;
        public WindchillDocConnector()
        {
            _docClient = new ExtClient("ExtPort");
        }

        public void DownloadDocList(string productCode, string productRevision)
        {
            var docList = GetDocumentList(productCode, productRevision);
            var docsToDownload = GetDocsToDownload(docList);
            foreach (var docToDownload in docsToDownload)
            {
                DownloadDoc(docToDownload);
            }
        }

        private List<wsRevisionControlled> GetDocsToDownload(List<wsRevisionControlled> docList)
        {
            //leggi dati da xml qui;
            return docList;
        }

        private List<wsRevisionControlled> GetDocumentList(string productCode, string productRevision)
        {
            List<wsRevisionControlled> docList = new List<wsRevisionControlled>();

            var files = _docClient.getRelatedDocuments(productCode, productRevision, "");
            foreach (var file in files)
            {
                //Aggiungi info ai doc  qui;
                docList.Add(file);
            }

            return docList;
        }

        private void DownloadDoc(wsRevisionControlled docInfo)
        {
            var fileData = _docClient.download(docInfo.name, docInfo.number, docInfo.revision, "");
            //using (MemoryStream ms = new MemoryStream(Convert.FromBase64String(fileData.content)))
            //{
            //    var image = Image.FromStream(ms);
            //    image.Save($"C:\\temp\\{fileData.fileName}", ImageFormat.Jpeg);
            //}
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
