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
        //Metodo per gestire la chiamata al Webservice, prende in input una istanza di classe(fra quelle del modello) e restituisce un oggetto di tipo InforResult
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
                var methodToCall = addressList.FirstOrDefault(x => x.Key.Contains(reportRequest.GetType().Name));
                if ((methodToCall.Key != null) && (methodToCall.Value != null))
                {
                    _url = methodToCall.Value;
                }
                else
                {
                    return new InforResult(false, "CallWebService: Metodo non trovato");
                }
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

            XmlDocument soapEnvelopeXml = CreateSoapEnvelope(reportRequest, out resultCreateEnvelope);
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

        // Metodo per creare WebRequest, la action non viene utilizzata
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

        //Metodo per comporre Envelop xlm con i dati passati in input 
        private static XmlDocument CreateSoapEnvelope<T>(T reportRequestEnvelope, out InforResult result)
        {
            XmlDocument soapEnvelopeDocument = new XmlDocument();
            try
            {
                if (reportRequestEnvelope is ReportProduction)
                {
                    soapEnvelopeDocument.LoadXml(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:iwm=""http://www.infor.com/businessinterface/IWMStdReportProduction""><soapenv:Header><iwm:Activation><company>" + (reportRequestEnvelope as ReportProduction).Company + "</company></iwm:Activation></soapenv:Header><soapenv:Body><iwm:ReportProduction><ReportProductionRequest><!--Optional:--><ControlArea><!--Optional:--><processingScope>" + (reportRequestEnvelope as ReportProduction).ProcessingScope + "</processingScope></ControlArea><!--Optional:--><DataArea><!--Zero or more repetitions:--><IWMStdReportProduction><ProductionOrder>" + (reportRequestEnvelope as ReportProduction).ProductionOrder + "</ProductionOrder><!--Optional:--><QtyDeliver>" + (reportRequestEnvelope as ReportProduction).QtyDeliver + "</QtyDeliver><!--Optional:--><ReportPrevious>" + (reportRequestEnvelope as ReportProduction).ReportPrevious + "</ReportPrevious><!--Optional:--><BackFlush>" + (reportRequestEnvelope as ReportProduction).BackFlush + "</BackFlush><!--Optional:--><DirectReceipt>" + (reportRequestEnvelope as ReportProduction).DirectReceipt + "</DirectReceipt><!--Optional:--><Complete>" + (reportRequestEnvelope as ReportProduction).Complete + "</Complete><ReportMore>" + (reportRequestEnvelope as ReportProduction).ReportMore + "</ReportMore></IWMStdReportProduction></DataArea></ReportProductionRequest></iwm:ReportProduction></soapenv:Body></soapenv:Envelope>");
                }
                else if (reportRequestEnvelope is UnplannedMat)
                {
                    soapEnvelopeDocument.LoadXml(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:iwm=""http://www.infor.com/businessinterface/IWMStdUnplannedMatlIssue""><soapenv:Header><iwm:Activation><company>" + (reportRequestEnvelope as UnplannedMat).Company + "</company></iwm:Activation></soapenv:Header><soapenv:Body><iwm:IssueMaterial><IssueMaterialRequest><!--Optional:--><ControlArea><!--Optional:--><processingScope>" + (reportRequestEnvelope as UnplannedMat).ProcessingScope + "</processingScope></ControlArea><!--Optional:--><DataArea><!--Zero or more repetitions:--><IWMStdUnplannedMatlIssue><ProdOrder>" + (reportRequestEnvelope as UnplannedMat).ProdOrder + "</ProdOrder><!--Optional:--><Operation>" + (reportRequestEnvelope as UnplannedMat).Operation + "</Operation><!--Optional:--><Item>" + (reportRequestEnvelope as UnplannedMat).Item + "</Item><!--Optional:--><Warehouse>" + (reportRequestEnvelope as UnplannedMat).Warehouse + "</Warehouse><!--<Location>PREL100</Location><LotCode>?</LotCode><SerialNumber>?</SerialNumber>--><Quantity>" + (reportRequestEnvelope as UnplannedMat).Quantity + "</Quantity><Position>" + (reportRequestEnvelope as UnplannedMat).Position + "</Position><!--Optional:--><!--Optional:--><GenerateOutbound>" + (reportRequestEnvelope as UnplannedMat).GenerateOutbound + "</GenerateOutbound><!--Optional:--><ReleaseOutbound>" + (reportRequestEnvelope as UnplannedMat).ReleaseOutbound + "</ReleaseOutbound><!--Optional:--></IWMStdUnplannedMatlIssue></DataArea></IssueMaterialRequest></iwm:IssueMaterial></soapenv:Body></soapenv:Envelope>");
                }
                else if (reportRequestEnvelope is InvTransfer)
                {
                    soapEnvelopeDocument.LoadXml(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:iwm=""http://www.infor.com/businessinterface/IWMStdInvTransfer""><soapenv:Header><iwm:Activation><!--Optional:--><company>" + (reportRequestEnvelope as InvTransfer).Company + "</company></iwm:Activation></soapenv:Header><soapenv:Body><iwm:InvTransfer><InvTransferRequest><!--Optional:--><ControlArea><!--Optional:--><processingScope>" + (reportRequestEnvelope as InvTransfer).ProcessingScope + "</processingScope></ControlArea><!--Optional:--><DataArea><!--Zero or more repetitions:--><IWMStdInvTransfer><!--Optional:--><Item>" + (reportRequestEnvelope as InvTransfer).Item + "</Item><!--Optional:--><FromWarehouse>" + (reportRequestEnvelope as InvTransfer).FromWarehouse + "</FromWarehouse><!--Optional:--><ToWarehouse>" + (reportRequestEnvelope as InvTransfer).ToWarehouse + "</ToWarehouse><!--Optional:--><FromLocation>" + (reportRequestEnvelope as InvTransfer).FromLocation + "</FromLocation><!--Optional:--><ToLocation>" + (reportRequestEnvelope as InvTransfer).ToLocation + "</ToLocation><!--Optional:--><LotCode/><StorageUnit>" + (reportRequestEnvelope as InvTransfer).StorageUnit + "</StorageUnit><StorageQuantity>" + (reportRequestEnvelope as InvTransfer).StorageQuantity + "</StorageQuantity><!--Optional:--></IWMStdInvTransfer></DataArea></InvTransferRequest></iwm:InvTransfer></soapenv:Body></soapenv:Envelope>");
                }
                else if (reportRequestEnvelope is OperatorOperation)
                {
                    soapEnvelopeDocument.LoadXml(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:sfc=""http://www.infor.com/businessinterface/SFCOperatorOperation""><soapenv:Header><sfc:Activation><!--Optional:--><username>?</username><!--Optional : --><password>?</password><!--Optional : --><company>" + (reportRequestEnvelope as OperatorOperation).Company + "</company></sfc:Activation></soapenv:Header><soapenv:Body><sfc:Change><ChangeRequest><!--Optional:--><ControlArea><!--Optional:--><processingScope>" + (reportRequestEnvelope as OperatorOperation).ProcessingScope + "</processingScope></ControlArea><!--Optional:--><DataArea><!--Zero or more repetitions: --><SFCOperatorOperation><ProductionOrderID>" + (reportRequestEnvelope as OperatorOperation).ProdOrder + "</ProductionOrderID><OperationID>" + (reportRequestEnvelope as OperatorOperation).Operation + "</OperationID><!--Optional:--><OperationStatus>" + (reportRequestEnvelope as OperatorOperation).OperationStatus + "</OperationStatus><!--Optional:--><ActualProductionStartDate>?</ActualProductionStartDate><!--Optional:--><QuantityCompleted><!--Optional:--><Value>" + (reportRequestEnvelope as OperatorOperation).Quantity + "</Value><!--Optional:--><UOM>?</UOM><!--Optional:--><DisplayFormat>?</DisplayFormat></QuantityCompleted><!--Optional:--><QuantityRejected><!--Optional:--><Value>?</Value><!--Optional:--><UOM>?</UOM><!--Optional:--><DisplayFormat>?</DisplayFormat></QuantityRejected><!--Optional:--><QuantityScrapped><!--Optional:--><Value>?</Value><!--Optional:--><UOM>?</UOM><!--Optional:--><DisplayFormat>?</DisplayFormat></QuantityScrapped><!--Optional:--><QuantityQuarantined><!--Optional:--><Value>?</Value><!--Optional:--><UOM>?</UOM><!--Optional:--><DisplayFormat>?</DisplayFormat></QuantityQuarantined><!--Optional:--><RejectReasonID>?</RejectReasonID><!--Optional:--><RejectReasonDescription>?</RejectReasonDescription><!--Optional:--><RemainingProductionTime><!--Optional:--><Value>?</Value><!--Optional:--><UOM>?</UOM><!--Optional:--><DisplayFormat>?</DisplayFormat></RemainingProductionTime><!--Optional:--><PostToInventoryIndicator>?</PostToInventoryIndicator><!--Optional:--><DirectReceiveIndicator>?</DirectReceiveIndicator><!--Zero or more repetitions: --><SerializedItem actionType = \"change\"><SerialNumber>?</SerialNumber><!--Optional:--><RejectedIndicator>?</RejectedIndicator></SerializedItem></SFCOperatorOperation></DataArea></ChangeRequest></sfc:Change></soapenv:Body></soapenv:Envelope>");
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

        //Metodo per inserire la Envelop creata nella WebRequest
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

        //Metodo che legge file di configurazione corrente ed inserisce in un Dictionary la coppia( Nome Metodo, Url del metodo)
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

        //Metodo per parsare WebResponse, viene fatto un controllo sui valori di alcuni tag
        private static InforResult ParseWebResponse<T>(WebResponse webResponse, T reportRequest)
        {
            XDocument document = null;
            string productionOrder = string.Empty;
            string resultMessage = string.Empty;
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
                productionOrder = (reportRequest as ReportProduction).ProductionOrder;
                if (string.IsNullOrEmpty(document.Descendants().FirstOrDefault(p => p.Name.LocalName == "ReceiptNumber").Value))
                {
                    return new InforResult(true, "ParseWebResponse : ReceiptNumber non presente per l'ordine: " + (reportRequest as ReportProduction).ProductionOrder.Trim());
                }
                // per ora InforCallSucceded = false da verificare PRXXX
                else if (document.Descendants().FirstOrDefault(p => p.Name.LocalName == "OutData").Value.StartsWith("1,99") == false)
                {
                    return new InforResult(false, "ParseWebResponse : Campo OutData non ha stringa iniziale 1,99 per l'ordine: " + (reportRequest as ReportProduction).ProductionOrder.Trim());
                }

                resultMessage = " chiamata IWMStdReportProduction per l'ordine: " + productionOrder;
            }
            else if (document.ToString().Contains("IWMStdUnplannedMatlIssue"))
            {
                productionOrder = (reportRequest as UnplannedMat).ProdOrder;
                if (string.IsNullOrEmpty(document.Descendants().FirstOrDefault(p => p.Name.LocalName == "ReceiptNumber").Value))
                {
                    return new InforResult(true, "ParseWebResponse : ReceiptNumber non presente per l'ordine " + (reportRequest as UnplannedMat).ProdOrder.Trim());
                }
                // per ora InforCallSucceded = false da verificare PRXXX
                else if (document.Descendants().FirstOrDefault(p => p.Name.LocalName == "OutData").Value.StartsWith("1,99") == false)
                {
                    return new InforResult(false, "ParseWebResponse :  Campo OutData non ha stringa iniziale 1,99 per l'ordine:  " + (reportRequest as UnplannedMat).ProdOrder.Trim());
                }

                resultMessage = " chiamata IWMStdUnplannedMatlIssue per l'ordine: " + productionOrder;
            }
            else if (document.ToString().Contains("IWMStdInvTransfer"))
            {
                //if (string.IsNullOrEmpty(document.Descendants().FirstOrDefault(p => p.Name.LocalName == "Item").Value))
                //{

                //}
                //resultMessage = " chiamata IWMStdInvTransfer per l'item: " + (reportRequest as MaterialNonConformance).Item;
            }
            else if (document.ToString().Contains("SFCOperatorOperation"))
            {
                productionOrder = (reportRequest as OperatorOperation).ProdOrder;
                if (string.IsNullOrEmpty(document.Descendants().FirstOrDefault(p => p.Name.LocalName == "QuantityCompleted").Value))
                {
                    return new InforResult(true, "ParseWebResponse : QuantityCompleted non presente per l'ordine " + (reportRequest as OperatorOperation).ProdOrder.Trim());
                }
                else if (Convert.ToInt32(document.Descendants().FirstOrDefault(p => p.Name.LocalName == "QuantityCompleted").Value) < (reportRequest as OperatorOperation).Quantity)
                {
                    return new InforResult(false, "ParseWebResponse : Risposta errata per l'ordine " + (reportRequest as OperatorOperation).ProdOrder.Trim() + "  la quantità completata è minore della quantità inviata");
                }

                resultMessage = " chiamata SFCOperatorOperation per l'ordine: " + productionOrder;
            }
            else
            {
                return new InforResult(false, "ParseWebResponse : Risposta non contiene stringa metodo chiamante");
            }

            return new InforResult(true, "ParseWebResponse : Risposta corretta per la" + resultMessage);
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

        public static InforResult ReportOperationProgress(OperatorOperation opProgress)
        {
            var result = new InforResult();

            try
            {
                result = InforConnector.CallWebService(opProgress);

                return result;
            }
            catch (Exception ex)
            {
                result = new InforResult(false, ex.Message);

                return result;
            }
        }

        public static InforResult ReportMaterialNonConformance(InvTransfer matNonConformance)
        {
            var result = new InforResult();

            try
            {
                result = InforConnector.CallWebService(matNonConformance);

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
