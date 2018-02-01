using InforConnectorLibrary.InforProducedQuantity;
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
using System.Configuration;
using System.ServiceModel.Configuration;

namespace InforConnectorLibrary
{
    public static class InforConnector
    {
        public static InforResult CallWebService<T>(T reportRequest)
        {
            //var _url = "http://192.168.1.31:8312/c4ws/services/IWMStdReportProduction/lntestclone";
            //var _url = "http://192.168.1.31:8312/c4ws/services/IWMStdUnplannedMatlIssue/lntestclone?wsdl";
            //var _action = "http://xxxxxxxx/Service1.asmx?op=HelloWorld";
            var _action = "";

            Dictionary<string, string> addressList = new Dictionary<string, string>();

            var resultAddress = ReadConfigFile(out addressList);

            string _url = string.Empty;

            if (resultAddress.InforCallSucceeded == false)
            {
                return resultAddress;
            }

            try
            {
                var methodToCall = addressList.First(x => x.Key.Contains(reportRequest.GetType().Name.ToString()));
                _url = methodToCall.Value;
            }
            catch (InvalidOperationException ex)
            {
                return new InforResult(false, "CallWebService: " + ex.Message);
            }
            catch (ArgumentNullException ex)
            {
                return new InforResult(false, "CallWebService: " + ex.Message);
            }

            var resultCreateEnvelope = new InforResult();

            string erpOrder = string.Empty;

            XmlDocument soapEnvelopeXml = CreateSoapEnvelope(reportRequest, out erpOrder, out resultCreateEnvelope);
            if (resultCreateEnvelope.InforCallSucceeded == false)
            {
                return resultCreateEnvelope;
            }

            InforResult createWebRequestResult = new InforResult();
            HttpWebRequest webRequest = CreateWebRequest(_url, _action, out createWebRequestResult);
            if (createWebRequestResult.InforCallSucceeded == false)
            {
                return createWebRequestResult;
            }

            var insertResult = InsertSoapEnvelopeIntoWebRequest(soapEnvelopeXml, webRequest);
            if (insertResult.InforCallSucceeded == false)
            {
                return insertResult;
            }

            // begin async call to web request.
            IAsyncResult asyncResult = null;
            try
            {
                asyncResult = webRequest.BeginGetResponse(null, null);
            }
            catch (WebException ex)
            {
                if (ex.InnerException != null)
                {
                    return new InforResult(false, "BeginGetResponse: " + ex.InnerException.ToString());
                }
                else if (ex.Message != null)
                {
                    return new InforResult(false, ex.Message);
                }
                return new InforResult(false, "BeginGetResponse: Errore nella BeginGetResponse");
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                {
                    return new InforResult(false, "BeginGetResponse: " + ex.InnerException.ToString());
                }
                else if (ex.Message != null)
                {
                    return new InforResult(false, "BeginGetResponse: " + ex.Message);
                }
                return new InforResult(false, "Errore nella BeginGetResponse");
            }

            // suspend this thread until call is complete. You might want to
            // do something usefull here like update your UI.
            try
            {
                asyncResult.AsyncWaitHandle.WaitOne();
            }
            catch (Exception ex)
            {

                return new InforResult(false, "AsyncWaitHandle: " + ex.Message);
            }

            // get the response from the completed web request.
            try
            {
                using (WebResponse webResponse = webRequest.EndGetResponse(asyncResult))
                {
                    try
                    {
                        InforResult webResponseResult = ParseWebResponse(webResponse, erpOrder);

                        if (webResponseResult.InforCallSucceeded == false)
                        {
                            return webResponseResult;
                        }
                    }
                    catch (Exception ex)
                    {
                        return new InforResult(false, "ParseWebResponse: " + ex.Message);
                    }
                }
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                {
                    return new InforResult(false, "EndGetResponse: " + ex.InnerException.ToString());
                }

                return new InforResult(false, "EndGetResponse: " + ex.Message);
            }

            return new InforResult(true, "Chiamata eseguita con successo!");
        }

        private static HttpWebRequest CreateWebRequest(string url, string action, out InforResult createWebRequestResult)
        {
            createWebRequestResult = new InforResult();
            try
            {
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url);
                webRequest.Headers.Add("SOAPAction", "");
                webRequest.ContentType = "text/xml;charset=\"utf-8\"";
                webRequest.Accept = "text/xml";
                webRequest.Method = "POST";

                createWebRequestResult.InforCallSucceeded = true;
                createWebRequestResult.Error = "CreateWebRequest: Web request creata con successo";
                return webRequest;

            }
            catch (Exception ex)
            {

                createWebRequestResult.InforCallSucceeded = false;
                createWebRequestResult.Error = "CreateWebRequest: " + ex.Message;
                return null;
            }
        }

        private static XmlDocument CreateSoapEnvelope<T>(T reportRequestEnvelope, out string productionOrder, out InforResult result)
        {
            XmlDocument soapEnvelopeDocument = new XmlDocument();
            productionOrder = "";
            try
            {
                if (reportRequestEnvelope is ReportProduction)
                {
                    productionOrder = (reportRequestEnvelope as ReportProduction).ProductionOrder;
                    soapEnvelopeDocument.LoadXml(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:iwm=""http://www.infor.com/businessinterface/IWMStdReportProduction""><soapenv:Header><iwm:Activation><company>" + (reportRequestEnvelope as ReportProduction).Company + "</company></iwm:Activation></soapenv:Header><soapenv:Body><iwm:ReportProduction><ReportProductionRequest><!--Optional:--><ControlArea><!--Optional:--><processingScope>" + (reportRequestEnvelope as ReportProduction).ProcessingScope + "</processingScope></ControlArea><!--Optional:--><DataArea><!--Zero or more repetitions:--><IWMStdReportProduction><ProductionOrder>" + (reportRequestEnvelope as ReportProduction).ProductionOrder + "</ProductionOrder><!--Optional:--><QtyDeliver>" + (reportRequestEnvelope as ReportProduction).QtyDeliver + "</QtyDeliver><!--Optional:--><ReportPrevious>" + (reportRequestEnvelope as ReportProduction).ReportPrevious + "</ReportPrevious><!--Optional:--><BackFlush>" + (reportRequestEnvelope as ReportProduction).BackFlush + "</BackFlush><!--Optional:--><DirectReceipt>" + (reportRequestEnvelope as ReportProduction).DirectReceipt + "</DirectReceipt><!--Optional:--><Complete>" + (reportRequestEnvelope as ReportProduction).Complete + "</Complete><ReportMore>" + (reportRequestEnvelope as ReportProduction).ReportMore + "</ReportMore></IWMStdReportProduction></DataArea></ReportProductionRequest></iwm:ReportProduction></soapenv:Body></soapenv:Envelope>");
                }
                else if (reportRequestEnvelope is UnplannedMat)
                {
                    productionOrder = (reportRequestEnvelope as UnplannedMat).ProdOrder;
                    soapEnvelopeDocument.LoadXml(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:iwm=""http://www.infor.com/businessinterface/IWMStdUnplannedMatlIssue""><soapenv:Header><iwm:Activation><company>" + (reportRequestEnvelope as UnplannedMat).Company + "</company></iwm:Activation></soapenv:Header><soapenv:Body><iwm:IssueMaterial><IssueMaterialRequest><!--Optional:--><ControlArea><!--Optional:--><processingScope>" + (reportRequestEnvelope as UnplannedMat).ProcessingScope + "</processingScope></ControlArea><!--Optional:--><DataArea><!--Zero or more repetitions:--><IWMStdUnplannedMatlIssue><ProdOrder>" + (reportRequestEnvelope as UnplannedMat).ProdOrder + "</ProdOrder><!--Optional:--><Operation>" + (reportRequestEnvelope as UnplannedMat).Operation + "</Operation><!--Optional:--><Item>" + (reportRequestEnvelope as UnplannedMat).Item + "</Item><!--Optional:--><Warehouse>" + (reportRequestEnvelope as UnplannedMat).Warehouse + "</Warehouse><!--<Location>PREL100</Location><LotCode>?</LotCode><SerialNumber>?</SerialNumber>--><Quantity>" + (reportRequestEnvelope as UnplannedMat).Quantity + "</Quantity><Position>" + (reportRequestEnvelope as UnplannedMat).Position + "</Position><!--Optional:--><!--Optional:--><GenerateOutbound>" + (reportRequestEnvelope as UnplannedMat).GenerateOutbound + "</GenerateOutbound><!--Optional:--><ReleaseOutbound>" + (reportRequestEnvelope as UnplannedMat).ReleaseOutbound + "</ReleaseOutbound><!--Optional:--></IWMStdUnplannedMatlIssue></DataArea></IssueMaterialRequest></iwm:IssueMaterial></soapenv:Body></soapenv:Envelope>");
                }
                else if (reportRequestEnvelope is MaterialNonConformance)
                {
                    productionOrder = (reportRequestEnvelope as MaterialNonConformance).ProductionOrder;
                }
                else if (reportRequestEnvelope is OperationProgress)
                {
                    productionOrder = (reportRequestEnvelope as OperationProgress).ProdOrder;
                }

                result = new InforResult(true, "CreateSoapEnvelope: Envelope creato con successo!");

                //soapEnvelopeDocument.LoadXml(@"<SOAP-ENV:Envelope xmlns:SOAP-ENV=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:xsi=""http://www.w3.org/1999/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/1999/XMLSchema""><SOAP-ENV:Body><HelloWorld xmlns=""http://tempuri.org/"" SOAP-ENV:encodingStyle=""http://schemas.xmlsoap.org/soap/encoding/""><int1 xsi:type=""xsd:integer"">12</int1><int2 xsi:type=""xsd:integer"">32</int2></HelloWorld></SOAP-ENV:Body></SOAP-ENV:Envelope>");
                //soapEnvelopeDocument.LoadXml(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:iwm=""http://www.infor.com/businessinterface/IWMStdReportProduction""><soapenv:Header><iwm:Activation><company>100</company></iwm:Activation></soapenv:Header><soapenv:Body><iwm:ReportProduction><ReportProductionRequest><!--Optional:--><ControlArea><!--Optional:--><processingScope>request</processingScope></ControlArea><!--Optional:--><DataArea><!--Zero or more repetitions:--><IWMStdReportProduction><ProductionOrder>D02220137</ProductionOrder><!--Optional:--><QtyDeliver>1</QtyDeliver><!--Optional:--><ReportPrevious>yes</ReportPrevious><!--Optional:--><BackFlush>yes</BackFlush><!--Optional:--><DirectReceipt>yes</DirectReceipt><!--Optional:--><Complete>no</Complete><ReportMore>no</ReportMore></IWMStdReportProduction></DataArea></ReportProductionRequest></iwm:ReportProduction></soapenv:Body></soapenv:Envelope>");
                //soapEnvelopeDocument.LoadXml(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:iwm=""http://www.infor.com/businessinterface/IWMStdUnplannedMatlIssue""><soapenv:Header><iwm:Activation><company>100</company></iwm:Activation></soapenv:Header><soapenv:Body><iwm:IssueMaterial><IssueMaterialRequest><!--Optional:--><ControlArea><!--Optional:--><processingScope>request</processingScope></ControlArea><!--Optional:--><DataArea><!--Zero or more repetitions:--><IWMStdUnplannedMatlIssue><ProdOrder>D02220137</ProdOrder><!--Optional:--><Operation>10</Operation><!--Optional:--><Item>         002612155</Item><!--Optional:--><Warehouse>D100</Warehouse><!--<Location>PREL100</Location><LotCode>?</LotCode><SerialNumber>?</SerialNumber>--><Quantity>1</Quantity><!--Optional:--><Unit>NR</Unit><!--Optional:--><GenerateOutbound>no</GenerateOutbound><!--Optional:--><ReleaseOutbound>no</ReleaseOutbound><!--Optional:--><LoginCode>extcdm</LoginCode></IWMStdUnplannedMatlIssue></DataArea></IssueMaterialRequest></iwm:IssueMaterial></soapenv:Body></soapenv:Envelope>");

            }
            catch (XmlException ex)
            {

                if (ex.InnerException != null)
                {
                    result = new InforResult(false, "CreateSoapEnvelope: " + ex.InnerException.ToString());
                }
                else if (ex.Message != null)
                {
                    result = new InforResult(false, "CreateSoapEnvelope: " + ex.Message);
                }
                else
                {
                    result = new InforResult(false, "CreateSoapEnvelope: Errore nella creazione Xml SoapEnvelop ");
                }
            }

            return soapEnvelopeDocument;
        }

        private static InforResult InsertSoapEnvelopeIntoWebRequest(XmlDocument soapEnvelopeXml, HttpWebRequest webRequest)
        {
            var result = new InforResult();

            try
            {
                using (Stream stream = webRequest.GetRequestStream())
                {
                    soapEnvelopeXml.Save(stream);

                    result = new InforResult(true, "InsertSoapEnvelopeIntoWebRequest: Envelope request inviata correttamente");
                }
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                {
                    result = new InforResult(false, "InsertSoapEnvelopeIntoWebRequest: " + ex.InnerException.ToString());
                }
                else
                {
                    result = new InforResult(false, "InsertSoapEnvelopeIntoWebRequest: " + ex.Message);
                }

            }

            return result;
        }

        //public static string ReportQuantity(int qty)
        //{
        //    using (WMStdReportProductionClient client = new WMStdReportProductionClient("IWMStdReportProductionSoapPort"))
        //    {
        //        using (new OperationContextScope(client.InnerChannel))
        //        {
        //            ActivationType activation = new ActivationType { company = 100 };

        //            //string headers = "<Header><h:Activation xmlns:h=\"http://www.infor.com/businessinterface/IWMStdReportProduction\" xmlns=\"http://www.infor.com/businessinterface/IWMStdReportProduction\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><company>100</company></h:Activation></Header>";

        //            //var headerXML = XElement.Parse(headers);
        //            //// ("Activation", "http://www.infor.com/businessinterface/IWMStdReportProduction");
        //            //foreach (var header in headerXML.Elements())
        //            //{
        //            //    MessageVersion mv = MessageVersion.Soap11;
        //            //    var message = System.ServiceModel.Channels.Message.CreateMessage(/*OperationContext.Current.IncomingMessageVersion*/ mv, header.Name.LocalName, new StringXmlDataWriter(header.ToString()));

        //            //}
        //            //OperationContext.Current.OutgoingMessageHeaders.RemoveAt(0);

        //            //MessageHeader header = MessageHeader.CreateHeader("Activation", "http://www.infor.com/businessinterface/IWMStdReportProduction","<company>100</company>");
        //            //OperationContext.Current.OutgoingMessageHeaders.Add(header);

        //            ReportProductionRequestType reportProductionRequest = new ReportProductionRequestType
        //            {
        //                ControlArea = new ReportProductionRequestTypeControlArea { processingScope = processingScope.request },
        //                DataArea = new ReportProductionRequestTypeIWMStdReportProduction[]
        //                {
        //                    new ReportProductionRequestTypeIWMStdReportProduction
        //                    {
        //                        ProductionOrder = "D01264561",
        //                        QtyDeliver = qty,
        //                        ReportPrevious = "yes",
        //                        BackFlush = "yes",
        //                        DirectReceipt = "yes",
        //                        Complete = "no",
        //                        ReportMore = "no"
        //                        //GenerateInbound = "no",
        //                        //ReleaseInbound = "no",
        //                        //RunNumber = "D02137031"
        //                    }
        //                }
        //            };
        //            try
        //            {
        //                var response = client.ReportProduction(activation, reportProductionRequest);
        //                if (response.DataArea.First().OutData == null)
        //                {
        //                    //MessageFault msgFault = response;
        //                    return response.DataArea.First().ToString();
        //                }
        //            }
        //            catch (FaultException fe)
        //            {
        //                FaultException faultException = (FaultException)fe;
        //                MessageFault msgFault = faultException.CreateMessageFault();
        //                return msgFault.ToString();
        //                //XmlElement elm = msgFault.GetDetail<XmlElement>();
        //            }
        //        }
        //        return string.Empty;
        //    }
        //}

        private static InforResult ReadConfigFile(out Dictionary<string, string> addressList)
        {
            try
            {
                Dictionary<string, string> configURL = new Dictionary<string, string>();

                var configFile = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
                var settings = configFile.AppSettings.Settings;

                ClientSection clientSettings = ConfigurationManager.GetSection("system.serviceModel/client") as ClientSection;

                string address = null;
                string name = null;

                foreach (ChannelEndpointElement endpoint in clientSettings.Endpoints)
                {
                    address = endpoint.Address.ToString();
                    name = endpoint.Name.ToString();
                    configURL.Add(name, address);
                }

                addressList = configURL;

                return new InforResult(true, "ReadConfigFile: Ottenuti urls dei metodi da file di configurazione");
            }
            catch (ConfigurationErrorsException err)
            {
                addressList = null;

                if (err.InnerException != null)
                {
                    return new InforResult(false, "ReadConfigFile: " + err.InnerException.ToString());
                }
                else if (err.Message != null)
                {
                    return new InforResult(false, "ReadConfigFile: " + err.Message);
                }
                else
                {
                    return new InforResult(false, "ReadConfigFile: Errore nella lettura del file di configurazione");
                }

            }
        }

        private static InforResult ParseWebResponse(WebResponse webResponse, string productionOrder)
        {

            XDocument document = null;
            try
            {
                string responseText = string.Empty;
                using (StreamReader sr = new StreamReader(webResponse.GetResponseStream(), Encoding.UTF8))
                {
                    responseText = sr.ReadToEnd();
                }

                document = XDocument.Parse(responseText);
            }
            catch (Exception ex)
            {

                return new InforResult(false, "XDocument.Parse error: " + ex.Message);
            }


            if (document.ToString().Contains("IWMStdReportProduction"))
            {
                if (string.IsNullOrEmpty(document.Descendants().Single(p => p.Name.LocalName == "ReceiptNumber").Value.ToString()))
                {
                    return new InforResult(true, "ParseWebResponse : Non e' stato possibile eseguire la chiamata per l'ordine " + productionOrder);
                }
                // per ora InforCallSucceded = false da verificare PRXXX
                else if (document.Descendants().Single(p => p.Name.LocalName == "OutData").Value.ToString().StartsWith("1,99") == false)
                {
                    return new InforResult(false, "ParseWebResponse : Risposta errata per l'ordine " + productionOrder);
                }
            }
            else if (document.ToString().Contains("IWMStdUnplannedMatlIssue"))
            {
                if (string.IsNullOrEmpty(document.Descendants().Single(p => p.Name.LocalName == "ReceiptNumber").Value.ToString()))
                {
                    return new InforResult(true, "ParseWebResponse : Non e' stato possibile eseguire la chiamata per l'ordine " + productionOrder);
                }
                // per ora InforCallSucceded = false da verificare PRXXX
                else if (document.Descendants().Single(p => p.Name.LocalName == "OutData").Value.ToString().StartsWith("1,99") == false)
                {
                    return new InforResult(false, "ParseWebResponse : Risposta errata per l'ordine " + productionOrder);
                }
            }
            else
            {
                return new InforResult(false, "ParseWebResponse : Risposta non contiene stringa metodo chiamante per l'ordine " + productionOrder);
            }

            Console.WriteLine("ParseWebResponse : Risposta corretta per l'ordine " + productionOrder);
            return new InforResult(true, "ParseWebResponse : Risposta corretta per l'ordine " + productionOrder);
        }

        public static InforResult ReportProducedQuantity(ReportProduction reportProd)
        {
            var result = new InforResult();

            try
            {
                result = InforConnector.CallWebService(reportProd);

                return result;
            }
            catch (Exception ex)
            {
                result = new InforResult(false, ex.Message);

                return result;
            }
        }

        public static InforResult ReportConsumedMaterial(UnplannedMat unplannedMat)
        {
            var result = new InforResult();

            try
            {
                result = InforConnector.CallWebService(unplannedMat);

                return result;
            }
            catch (Exception ex)
            {
                result = new InforResult(false, ex.Message);

                return result;
            }
        }
    }
}
