using InforConnector.InforProducedQuantity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using System.Net;
using System.IO;

namespace InforConnector
{
    public static class InforConnector
    {


        public static void CallWebService()
        {
            var _url = "http://192.168.1.31:8312/c4ws/services/IWMStdReportProduction/lntestclone";
            var _action = "http://xxxxxxxx/Service1.asmx?op=HelloWorld";

            XmlDocument soapEnvelopeXml = CreateSoapEnvelope();
            HttpWebRequest webRequest = CreateWebRequest(_url, _action);
            InsertSoapEnvelopeIntoWebRequest(soapEnvelopeXml, webRequest);

            // begin async call to web request.
            IAsyncResult asyncResult = webRequest.BeginGetResponse(null, null);

            // suspend this thread until call is complete. You might want to
            // do something usefull here like update your UI.
            asyncResult.AsyncWaitHandle.WaitOne();

            // get the response from the completed web request.
            string soapResult;
            using (WebResponse webResponse = webRequest.EndGetResponse(asyncResult))
            {
                using (StreamReader rd = new StreamReader(webResponse.GetResponseStream()))
                {
                    soapResult = rd.ReadToEnd();
                }
                Console.Write(soapResult);
            }
        }

        private static HttpWebRequest CreateWebRequest(string url, string action)
        {
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url);
            webRequest.Headers.Add("SOAPAction", action);
            webRequest.ContentType = "text/xml;charset=\"utf-8\"";
            webRequest.Accept = "text/xml";
            webRequest.Method = "POST";
            return webRequest;
        }

        private static XmlDocument CreateSoapEnvelope()
        {
            XmlDocument soapEnvelopeDocument = new XmlDocument();
            soapEnvelopeDocument.LoadXml(@"<SOAP-ENV:Envelope xmlns:SOAP-ENV=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:xsi=""http://www.w3.org/1999/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/1999/XMLSchema""><SOAP-ENV:Body><HelloWorld xmlns=""http://tempuri.org/"" SOAP-ENV:encodingStyle=""http://schemas.xmlsoap.org/soap/encoding/""><int1 xsi:type=""xsd:integer"">12</int1><int2 xsi:type=""xsd:integer"">32</int2></HelloWorld></SOAP-ENV:Body></SOAP-ENV:Envelope>");
            return soapEnvelopeDocument;
        }

        private static void InsertSoapEnvelopeIntoWebRequest(XmlDocument soapEnvelopeXml, HttpWebRequest webRequest)
        {
            using (Stream stream = webRequest.GetRequestStream())
            {
                soapEnvelopeXml.Save(stream);
            }
        }


        public static string ReportQuantity(int qty)
        {
            using (WMStdReportProductionClient client = new WMStdReportProductionClient("IWMStdReportProductionSoapPort"))
            {
                using (new OperationContextScope(client.InnerChannel))
                {

                    ActivationType activation = new ActivationType { company = 100 };

                    //string headers = "<Header><h:Activation xmlns:h=\"http://www.infor.com/businessinterface/IWMStdReportProduction\" xmlns=\"http://www.infor.com/businessinterface/IWMStdReportProduction\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><company>100</company></h:Activation></Header>";

                    //var headerXML = XElement.Parse(headers);
                    //// ("Activation", "http://www.infor.com/businessinterface/IWMStdReportProduction");
                    //foreach (var header in headerXML.Elements())
                    //{
                    //    MessageVersion mv = MessageVersion.Soap11;
                    //    var message = System.ServiceModel.Channels.Message.CreateMessage(/*OperationContext.Current.IncomingMessageVersion*/ mv, header.Name.LocalName, new StringXmlDataWriter(header.ToString()));

                    //}
                    //OperationContext.Current.OutgoingMessageHeaders.RemoveAt(0);

                    //MessageHeader header = MessageHeader.CreateHeader("Activation", "http://www.infor.com/businessinterface/IWMStdReportProduction","<company>100</company>");
                    //OperationContext.Current.OutgoingMessageHeaders.Add(header);

                    ReportProductionRequestType reportProductionRequest = new ReportProductionRequestType
                    {
                        ControlArea = new ReportProductionRequestTypeControlArea { processingScope = processingScope.request },
                        DataArea = new ReportProductionRequestTypeIWMStdReportProduction[]
                        {
                            new ReportProductionRequestTypeIWMStdReportProduction
                            {
                                ProductionOrder = "D01264561",
                                QtyDeliver = qty,
                                ReportPrevious = "yes",
                                BackFlush = "yes",
                                DirectReceipt = "yes",
                                Complete = "no",
                                ReportMore = "no"
                                //GenerateInbound = "no",
                                //ReleaseInbound = "no",
                                //RunNumber = "D02137031"
                            }
                        }
                    };
                    try
                    {
                        var response = client.ReportProduction(activation, reportProductionRequest);
                        if (response.DataArea.First().OutData == null)
                        {
                            //MessageFault msgFault = response;
                            return response.DataArea.First().ToString();
                        }
                    }
                    catch (FaultException fe)
                    {
                        FaultException faultException = (FaultException)fe;
                        MessageFault msgFault = faultException.CreateMessageFault();
                        return msgFault.ToString();
                        //XmlElement elm = msgFault.GetDetail<XmlElement>();
                    }



                }
                return string.Empty;
            }
        }
    }
}
