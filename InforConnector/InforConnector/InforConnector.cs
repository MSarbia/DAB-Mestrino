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

            var methodToCall = addressList.FirstOrDefault(x => x.Key.Contains(reportRequest.GetType().Name.ToString()));

            var _url = methodToCall.Value;

            var resultCreateEnvelope = new InforResult();

            string erpOrder;

            XmlDocument soapEnvelopeXml = CreateSoapEnvelope(reportRequest, out erpOrder, out resultCreateEnvelope);
            HttpWebRequest webRequest = CreateWebRequest(_url, _action);
            var insertResult = InsertSoapEnvelopeIntoWebRequest(soapEnvelopeXml, webRequest);
            if (insertResult.InforCallSucceeded == false)
            {
                return insertResult;
            }

            // begin async call to web request.
            IAsyncResult asyncResult = webRequest.BeginGetResponse(null, null);

            // suspend this thread until call is complete. You might want to
            // do something usefull here like update your UI.
            asyncResult.AsyncWaitHandle.WaitOne();

            // get the response from the completed web request.
            using (WebResponse webResponse = webRequest.EndGetResponse(asyncResult))
            {
                InforResult webResponseResult = ParseWebResponse(webResponse, erpOrder);

                if (webResponseResult.InforCallSucceeded == false)
                {
                    return webResponseResult;
                }

                //using (StreamReader rd = new StreamReader(webResponse.GetResponseStream()))
                //{
                //    using (XmlTextReader reader = new XmlTextReader(rd))
                //    {
                //        while (reader.Read())
                //        {
                //            if (reader.Name == "ReceiptNumber")
                //            {
                //                if (string.IsNullOrEmpty(reader.Value.ToString()))
                //                {
                //                    return new InforResult(false, "Non e' stato possibile eseguire la chiamata per l'ordine " + (reportRequest as reportRequest.GetType()) + "");
                //                }
                //            }
                //                //Console.WriteLine("{0}", reader.Value.Trim());
                //        }

                //        //soapResult = rd.ReadToEnd();
                //    }
                //}
                
                Console.Write(webResponse);
            }

            return new InforResult(true, "Chiamata eseguita con successo!");
        }

        private static HttpWebRequest CreateWebRequest(string url, string action)
        {
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url);
            webRequest.Headers.Add("SOAPAction", "");
            webRequest.ContentType = "text/xml;charset=\"utf-8\"";
            webRequest.Accept = "text/xml";
            webRequest.Method = "POST";
            return webRequest;
        }

        private static XmlDocument CreateSoapEnvelope<T>(T reportRequestEnvelope, out string productionOrder, out InforResult result)
        {            
            XmlDocument soapEnvelopeDocument = new XmlDocument();
            productionOrder = "";

            if (reportRequestEnvelope is ReportProduction)
            {
                productionOrder = (reportRequestEnvelope as ReportProduction).ProductionOrder;
                soapEnvelopeDocument.LoadXml(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:iwm=""http://www.infor.com/businessinterface/IWMStdReportProduction""><soapenv:Header><iwm:Activation><company>" + (reportRequestEnvelope as ReportProduction).Company + "</company></iwm:Activation></soapenv:Header><soapenv:Body><iwm:ReportProduction><ReportProductionRequest><!--Optional:--><ControlArea><!--Optional:--><processingScope>" + (reportRequestEnvelope as ReportProduction).ProcessingScope + "</processingScope></ControlArea><!--Optional:--><DataArea><!--Zero or more repetitions:--><IWMStdReportProduction><ProductionOrder>" + (reportRequestEnvelope as ReportProduction).ProductionOrder + "</ProductionOrder><!--Optional:--><QtyDeliver>" + (reportRequestEnvelope as ReportProduction).QtyDeliver + "</QtyDeliver><!--Optional:--><ReportPrevious>" + (reportRequestEnvelope as ReportProduction).ReportPrevious + "</ReportPrevious><!--Optional:--><BackFlush>" + (reportRequestEnvelope as ReportProduction).BackFlush + "</BackFlush><!--Optional:--><DirectReceipt>" + (reportRequestEnvelope as ReportProduction).DirectReceipt + "</DirectReceipt><!--Optional:--><Complete>." + (reportRequestEnvelope as ReportProduction).Complete + "</Complete><ReportMore>" + (reportRequestEnvelope as ReportProduction).ReportMore + "</ReportMore></IWMStdReportProduction></DataArea></ReportProductionRequest></iwm:ReportProduction></soapenv:Body></soapenv:Envelope>");
            }
            else if (reportRequestEnvelope is UnplannedMat)
            {
                productionOrder = (reportRequestEnvelope as UnplannedMat).ProdOrder;
                soapEnvelopeDocument.LoadXml(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:iwm=""http://www.infor.com/businessinterface/IWMStdUnplannedMatlIssue""><soapenv:Header><iwm:Activation><company>" + (reportRequestEnvelope as UnplannedMat).Company + "</company></iwm:Activation></soapenv:Header><soapenv:Body><iwm:IssueMaterial><IssueMaterialRequest><!--Optional:--><ControlArea><!--Optional:--><processingScope>" + (reportRequestEnvelope as UnplannedMat).ProcessingScope + "</processingScope></ControlArea><!--Optional:--><DataArea><!--Zero or more repetitions:--><IWMStdUnplannedMatlIssue><ProdOrder>" + (reportRequestEnvelope as UnplannedMat).ProdOrder + "</ProdOrder><!--Optional:--><Operation>" + (reportRequestEnvelope as UnplannedMat).Operation + "</Operation><!--Optional:--><Item>" + (reportRequestEnvelope as UnplannedMat).Item + "</Item><!--Optional:--><Warehouse>" + (reportRequestEnvelope as UnplannedMat).Warehouse + "</Warehouse><!--<Location>PREL100</Location><LotCode>?</LotCode><SerialNumber>?</SerialNumber>--><Quantity>" + (reportRequestEnvelope as UnplannedMat).Quantity + "</Quantity><!--Optional:--><Unit>" + (reportRequestEnvelope as UnplannedMat).Unit + "</Unit><!--Optional:--><GenerateOutbound>" + (reportRequestEnvelope as UnplannedMat).GenerateOutbound + "</GenerateOutbound><!--Optional:--><ReleaseOutbound>" + (reportRequestEnvelope as UnplannedMat).ReleaseOutbound + "</ReleaseOutbound><!--Optional:--><LoginCode>" + (reportRequestEnvelope as UnplannedMat).LoginCode + "</LoginCode></IWMStdUnplannedMatlIssue></DataArea></IssueMaterialRequest></iwm:IssueMaterial></soapenv:Body></soapenv:Envelope>");
            }
            else if (reportRequestEnvelope is MaterialNonConformance)
            {
                productionOrder = (reportRequestEnvelope as MaterialNonConformance).ProductionOrder;
            }
            else if (reportRequestEnvelope is OperationProgress)
            {
                productionOrder = (reportRequestEnvelope as OperationProgress).ProdOrder;
            }

            //soapEnvelopeDocument.LoadXml(@"<SOAP-ENV:Envelope xmlns:SOAP-ENV=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:xsi=""http://www.w3.org/1999/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/1999/XMLSchema""><SOAP-ENV:Body><HelloWorld xmlns=""http://tempuri.org/"" SOAP-ENV:encodingStyle=""http://schemas.xmlsoap.org/soap/encoding/""><int1 xsi:type=""xsd:integer"">12</int1><int2 xsi:type=""xsd:integer"">32</int2></HelloWorld></SOAP-ENV:Body></SOAP-ENV:Envelope>");
            //soapEnvelopeDocument.LoadXml(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:iwm=""http://www.infor.com/businessinterface/IWMStdReportProduction""><soapenv:Header><iwm:Activation><company>100</company></iwm:Activation></soapenv:Header><soapenv:Body><iwm:ReportProduction><ReportProductionRequest><!--Optional:--><ControlArea><!--Optional:--><processingScope>request</processingScope></ControlArea><!--Optional:--><DataArea><!--Zero or more repetitions:--><IWMStdReportProduction><ProductionOrder>D02220137</ProductionOrder><!--Optional:--><QtyDeliver>1</QtyDeliver><!--Optional:--><ReportPrevious>yes</ReportPrevious><!--Optional:--><BackFlush>yes</BackFlush><!--Optional:--><DirectReceipt>yes</DirectReceipt><!--Optional:--><Complete>no</Complete><ReportMore>no</ReportMore></IWMStdReportProduction></DataArea></ReportProductionRequest></iwm:ReportProduction></soapenv:Body></soapenv:Envelope>");
            //soapEnvelopeDocument.LoadXml(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:iwm=""http://www.infor.com/businessinterface/IWMStdUnplannedMatlIssue""><soapenv:Header><iwm:Activation><company>100</company></iwm:Activation></soapenv:Header><soapenv:Body><iwm:IssueMaterial><IssueMaterialRequest><!--Optional:--><ControlArea><!--Optional:--><processingScope>request</processingScope></ControlArea><!--Optional:--><DataArea><!--Zero or more repetitions:--><IWMStdUnplannedMatlIssue><ProdOrder>D02220137</ProdOrder><!--Optional:--><Operation>10</Operation><!--Optional:--><Item>         002612155</Item><!--Optional:--><Warehouse>D100</Warehouse><!--<Location>PREL100</Location><LotCode>?</LotCode><SerialNumber>?</SerialNumber>--><Quantity>1</Quantity><!--Optional:--><Unit>NR</Unit><!--Optional:--><GenerateOutbound>no</GenerateOutbound><!--Optional:--><ReleaseOutbound>no</ReleaseOutbound><!--Optional:--><LoginCode>extcdm</LoginCode></IWMStdUnplannedMatlIssue></DataArea></IssueMaterialRequest></iwm:IssueMaterial></soapenv:Body></soapenv:Envelope>");

            result = new InforResult(true, "Envelope creato con successo!");

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

                    result = new InforResult(true, "Envelope request inviata correttamente");
                }                
            }
            catch (Exception ex)
            {
                result = new InforResult(false, ex.InnerException.ToString());
            }

            return result;
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

        public static string ReadConfigFile(out Dictionary<string, string> addressList)
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

                string resultString = "Success!";

                return resultString;
            }
            catch (ConfigurationErrorsException err)
            {
                addressList = null;

                return err.ToString();
            }
        }

        public static InforResult ParseWebResponse(WebResponse webResponse, string productionOrder)
        {
            var document = XDocument.Parse(webResponse.ToString());

            if (document.ToString().Contains("IWMStdReportProduction"))
            {
                if (string.IsNullOrEmpty(document.Descendants().SingleOrDefault(p => p.Name.LocalName == "ReceiptNumber").Value.ToString()))
                {
                    return new InforResult(false, "Non e' stato possibile eseguire la chiamata per l'ordine " + productionOrder);
                }
                else if (document.Descendants().SingleOrDefault(p => p.Name.LocalName == "OutData").Value.ToString().StartsWith("1,99") == false)
                {
                    return new InforResult(false, "Risposta errata per l'ordine " + productionOrder);
                }                
            }
            else if (document.ToString().Contains("IWMStdUnplannedMatlIssue"))
            {
                if (string.IsNullOrEmpty(document.Descendants().SingleOrDefault(p => p.Name.LocalName == "ReceiptNumber").Value.ToString()))
                {
                    return new InforResult(false, "Non e' stato possibile eseguire la chiamata per l'ordine " + productionOrder);
                }

                else if (document.Descendants().SingleOrDefault(p => p.Name.LocalName == "OutData").Value.ToString().StartsWith("1,99") == false)
                {
                    return new InforResult(false, "Risposta errata per l'ordine " + productionOrder);
                }
            }
            
            return new InforResult(true, "Risposta corretta per l'ordine " + productionOrder);

            //using (StreamReader rd = new StreamReader(webResponse.GetResponseStream()))
            //{
            //    using (XmlTextReader reader = new XmlTextReader(rd))
            //    {
            //        reader.re 
            //        while (reader.Read())
            //        {
            //            if (reader.Name == "ReceiptNumber")
            //            {
            //                if (string.IsNullOrEmpty(reader.Value.ToString()))
            //                {
            //                    return new InforResult(false, "Non e' stato possibile eseguire la chiamata per l'ordine " + (reportRequest as reportRequest.GetType()) + "");
            //                }
            //            }
            //            //Console.WriteLine("{0}", reader.Value.Trim());
            //        }

            //        //soapResult = rd.ReadToEnd();
            //    }
            //}
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
                result = new InforResult(false, ex.Message.ToString());

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
                result = new InforResult(false, ex.Message.ToString());

                return result;
            }
        }
    }
}
