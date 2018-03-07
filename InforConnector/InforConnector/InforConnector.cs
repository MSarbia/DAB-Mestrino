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
                KeyValuePair<string, string> methodToCall;
                if (reportRequest is List<UnplannedMat>)
                {
                    methodToCall = addressList.FirstOrDefault(x => x.Key.Contains("UnplannedMat"));
                }
                else
                {
                    methodToCall = addressList.FirstOrDefault(x => x.Key.Contains(reportRequest.GetType().Name));
                }
                    
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
                        InforResult webResponseResult = ParseWebResponse(webResponse, reportRequest);
                        return webResponseResult;
                    }
                    catch (Exception ex)
                    {
                        return new InforResult(false, "ParseWebResponse: " + ex.Message);
                    }
                }
            }
            catch (FaultException ex)
            {
                MessageFault msgFault = ex.CreateMessageFault();
                return new InforResult(true, "EndGetResponse: " + ex.Message);
            }
            catch (WebException ex)
            {
                string exMessage = ex.Message;
                if (ex.Response != null)
                {
                    using (StreamReader responseReader = new StreamReader(ex.Response.GetResponseStream()))
                    {
                        exMessage = responseReader.ReadToEnd();
                        if (exMessage.Contains("faultstring"))
                        {
                            var doc = XDocument.Parse(exMessage);
                            exMessage = doc.Root.Descendants("faultstring").First().Value;
                        }
                    }
                }
                return new InforResult(false, "EndGetResponse: " + exMessage);
            }

            //return new InforResult(true, "Chiamata eseguita con successo!");
        }

        // Metodo per creare WebRequest, la action non viene utilizzata
        public static HttpWebRequest CreateWebRequest(string url, string action, out InforResult createWebRequestResult)
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
        public static XmlDocument CreateSoapEnvelope<T>(T reportRequestEnvelope, out InforResult result)
        {
            XmlDocument soapEnvelopeDocument = new XmlDocument();
            try
            {
                if (reportRequestEnvelope is ReportProduction)
                {
                    var reportProduction = reportRequestEnvelope as ReportProduction;
                    soapEnvelopeDocument.LoadXml(
                        $@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:iwm=""http://www.infor.com/businessinterface/IWMStdReportProduction"">
                            <soapenv:Header>
                                <iwm:Activation>
                                    <company>{reportProduction.Company}</company>
                                </iwm:Activation>
                            </soapenv:Header>
                            <soapenv:Body>
                                <iwm:ReportProduction>
                                    <ReportProductionRequest>
                                        <ControlArea>
                                            <processingScope>request</processingScope>
                                        </ControlArea>
                                        <DataArea>
                                            <IWMStdReportProduction>
                                                <ProductionOrder>{reportProduction.ProductionOrder}</ProductionOrder>
                                                <Warehouse>{reportProduction.FromWarehouse}</Warehouse>
                                                <BackFlush>yes</BackFlush>
                                                <Complete>{reportProduction.Complete}</Complete>
                                            </IWMStdReportProduction>
                                        </DataArea>
                                    </ReportProductionRequest>
                                </iwm:ReportProduction>
                            </soapenv:Body>
                        </soapenv:Envelope>");
                }
                else if (reportRequestEnvelope is UnplannedMat)
                {
                    var unplannedMat = reportRequestEnvelope as UnplannedMat;
                    string item = unplannedMat.Customized ? unplannedMat.Item : $"         {unplannedMat.Item}";
                    soapEnvelopeDocument.LoadXml($@"
                        <soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:iwm=""http://www.infor.com/businessinterface/IWMStdUnplannedMatlIssue"">
                            <soapenv:Header>
                                <iwm:Activation>
                                    <company>{unplannedMat.Company}</company>
                                </iwm:Activation>
                                </soapenv:Header>
                            <soapenv:Body>
                                <iwm:IssueMaterial>
                                    <IssueMaterialRequest>
                                        <ControlArea>
                                            <processingScope>request</processingScope>
                                        </ControlArea>
                                        <DataArea>
                                            <IWMStdUnplannedMatlIssue>
                                                <ProdOrder>{unplannedMat.ProdOrder}</ProdOrder>
                                                <Operation>{unplannedMat.Operation}</Operation>
                                                <Unit>{unplannedMat.Unit}</Unit>
                                                <Item>{item}</Item>
                                                <Warehouse>{unplannedMat.Warehouse}</Warehouse>
                                                <Location>{unplannedMat.Location}</Location>
                                                <Quantity>{unplannedMat.Quantity}</Quantity>
                                                <Position>{unplannedMat.Position}</Position>
                                                <GenerateOutbound>{unplannedMat.GenerateOutbound}</GenerateOutbound>
                                                <ReleaseOutbound>{unplannedMat.ReleaseOutbound}</ReleaseOutbound>
                                            </IWMStdUnplannedMatlIssue>
                                        </DataArea>
                                    </IssueMaterialRequest>
                                </iwm:IssueMaterial>
                            </soapenv:Body>
                    </soapenv:Envelope>");
                }
                else if(reportRequestEnvelope is List<UnplannedMat>)
                {
                    var unplannedMats = reportRequestEnvelope as List<UnplannedMat>;
                    string pre = $@"
                        <soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:iwm=""http://www.infor.com/businessinterface/IWMStdUnplannedMatlIssue"">
                            <soapenv:Header>
                                <iwm:Activation>
                                    <company>{unplannedMats.First().Company}</company>
                                </iwm:Activation>
                                </soapenv:Header>
                            <soapenv:Body>
                                <iwm:IssueMaterial>
                                    <IssueMaterialRequest>
                                        <ControlArea>
                                            <processingScope>request</processingScope>
                                        </ControlArea>
                                        <DataArea>";
                    string post = $@"</DataArea>
                                    </IssueMaterialRequest>
                                </iwm:IssueMaterial>
                            </soapenv:Body>
                    </soapenv:Envelope>";
                    string issues = "";
                    foreach(var materialIssue in unplannedMats)
                    {
                        string item = materialIssue.Customized ? materialIssue.Item : $"         {materialIssue.Item}";
                        issues += $@"<IWMStdUnplannedMatlIssue>
                                                <ProdOrder>{materialIssue.ProdOrder}</ProdOrder>
                                                <Operation>{materialIssue.Operation}</Operation>
                                                <Unit>{materialIssue.Unit}</Unit>
                                                <Item>{item}</Item>
                                                <Warehouse>{materialIssue.Warehouse}</Warehouse>
                                                <Location>{materialIssue.Location}</Location>
                                                <Quantity>{materialIssue.Quantity}</Quantity>
                                                <Position>{materialIssue.Position}</Position>
                                                <GenerateOutbound>{materialIssue.GenerateOutbound}</GenerateOutbound>
                                                <ReleaseOutbound>{materialIssue.ReleaseOutbound}</ReleaseOutbound>
                                            </IWMStdUnplannedMatlIssue>";
                    }
                    string doc = pre + issues + post;
                    soapEnvelopeDocument.LoadXml(doc);
                }
                else if (reportRequestEnvelope is InvTransfer)
                {
                    var invTransfer = reportRequestEnvelope as InvTransfer;
                    string item = invTransfer.Customized ? invTransfer.Item : $"         {invTransfer.Item}";

                    soapEnvelopeDocument.LoadXml($@"
                        <soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:iwm=""http://www.infor.com/businessinterface/IWMStdInvTransfer"">
                            <soapenv:Header>
                                <iwm:Activation>
                                    <company>{invTransfer.Company}</company>
                                </iwm:Activation>
                            </soapenv:Header>
                            <soapenv:Body>
                                <iwm:InvTransfer>
                                    <InvTransferRequest>
                                        <ControlArea>
                                            <processingScope>request</processingScope>
                                        </ControlArea>
                                        <DataArea>
                                            <IWMStdInvTransfer>
                                                <ToWarehouse>{invTransfer.ToWarehouse}</ToWarehouse>
                                                <Item>{invTransfer.Item}</Item>
                                                <StorageUnit>{invTransfer.StorageUnit}</StorageUnit>
                                                <StorageQuantity>{invTransfer.StorageQuantity}</StorageQuantity>
                                                <OrderNumber>{invTransfer.OrderNumber}</OrderNumber>
                                                <FromWarehouse>{invTransfer.FromWarehouse}</FromWarehouse>
                                                <FromLocation>{invTransfer.FromLocation}</FromLocation>
                                            </IWMStdInvTransfer>
                                        </DataArea>
                                    </InvTransferRequest>
                                </iwm:InvTransfer>
                            </soapenv:Body>
                        </soapenv:Envelope>");
                }
                else if (reportRequestEnvelope is OperatorOperation)
                {
                    var operatorOperation = reportRequestEnvelope as OperatorOperation;
                    string operationStatus = operatorOperation.OperationStatus.Equals("Completed") ? "<OperationStatus>Completed</OperationStatus>" : string.Empty;
                    soapEnvelopeDocument.LoadXml(
                        $@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:sfc=""http://www.infor.com/businessinterface/SFCOperatorOperation"">
	                        <soapenv:Header>
		                        <sfc:Activation>
			                        <company>{operatorOperation.Company}</company>
		                        </sfc:Activation>
	                        </soapenv:Header>
	                        <soapenv:Body>
		                        <sfc:Change>
			                        <ChangeRequest>
				                        <ControlArea>
					                        <processingScope>request</processingScope>
				                        </ControlArea>
				                        <DataArea>
                                            <SFCOperatorOperation>
                                                <ProductionOrderID>{operatorOperation.ProdOrder}</ProductionOrderID>
                                                <OperationID>{operatorOperation.Operation}</OperationID>
                                                <QuantityCompleted>
                                                    <Value>{operatorOperation.Quantity}</Value>
                                                    <UOM>{operatorOperation.UoM}</UOM>
                                                </QuantityCompleted>
                                                {operationStatus}
                                                <PostToInventoryIndicator>true</PostToInventoryIndicator>
                                                <DirectReceiveIndicator>true</DirectReceiveIndicator>
                                            </SFCOperatorOperation>
                                        </DataArea>
                                    </ChangeRequest>
                                </sfc:Change>
                            </soapenv:Body>
                        </soapenv:Envelope>");
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

            //<SFCOperatorOperation>
            //            <ProductionOrderID> D01265724 </ProductionOrderID>
            //            < OperationID > 10 </ OperationID >
            //            < QuantityCompleted >
            //                < Value > 3 </ Value >
            //                < UOM > NR </ UOM >
            //            </ QuantityCompleted >
            //            < OperationStatus > Complete </ OperationStatus > mettere il tag solo all-ultimo seriale
            //            < PostToInventoryIndicator > true </ PostToInventoryIndicator >
            //                  < DirectReceiveIndicator > true </ DirectReceiveIndicator >
            //        </ SFCOperatorOperation >

            //< IWMStdReportProduction >
            //      < ProductionOrder > D01265724 </ ProductionOrder >
            //      < Warehouse > D100 </ Warehouse >
            //      < BackFlush > yes </ BackFlush >
            //      < Complete > yes </ Complete > yes solo all-ultimo 
            //   </ IWMStdReportProduction >

            //< IWMStdUnplannedMatlIssue >
            //            < ProdOrder > D01265725 </ ProdOrder >
            //            < Operation > 10 </ Operation >
            //            < Unit > NR </ Unit >
            //            < Item > 002310123 </ Item > 9 spazi bianchi se !Customized
            //            < Warehouse > D100 </ Warehouse >
            //            < Location > PREL100 </ Location >
            //            < Quantity > 1 </ Quantity >
            //            < Position > 360 </ Position >
            //            < GenerateOutbound > yes </ GenerateOutbound >
            //            < ReleaseOutbound > yes </ ReleaseOutbound >
            // </ IWMStdUnplannedMatlIssue >


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
        public static InforResult ParseWebResponse<T>(WebResponse webResponse, T reportRequest)
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
                //responseText = $@"<?xml version=""1.0""?>
                //    <S:Envelope xmlns:S=""http://schemas.xmlsoap.org/soap/envelope/"">
                //        <S:Body>
                //            <ChangeResponse xmlns=""http://www.infor.com/businessinterface/SFCOperatorOperation"">
                //                <ChangeResponse xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns="""">
                //                    <DataArea>
                //                        <SFCOperatorOperation>
                //                            <ProductionOrderID>D01265725</ProductionOrderID>
                //                            <OperationID>10</OperationID>
                //                            <OperationStatus>Active</OperationStatus>
                //                            <ActualProductionStartDate>2018-02-16T11:27:01Z</ActualProductionStartDate>
                //                            <QuantityCompleted><Value>1</Value><UOM>NR</UOM></QuantityCompleted>
                //                            <QuantityRejected><Value>0</Value><UOM>NR</UOM></QuantityRejected>
                //                            <QuantityScrapped><Value>0</Value><UOM>NR</UOM></QuantityScrapped>
                //                            <QuantityQuarantined><Value>0</Value><UOM>NR</UOM></QuantityQuarantined>
                //                            <RemainingProductionTime><Value>0.1</Value><UOM>Hours</UOM></RemainingProductionTime>
                //                            <PostToInventoryIndicator>true</PostToInventoryIndicator>
                //                            <DirectReceiveIndicator>true</DirectReceiveIndicator>
                //                        </SFCOperatorOperation>
                //                    </DataArea>
                //                </ChangeResponse>
                //            </ChangeResponse>
                //        </S:Body>
                //    </S:Envelope>";

                document = XDocument.Parse(responseText);
            }
            catch (Exception ex)
            {
                return new InforResult(false, "XDocument.Parse error: " + ex.Message);
            }

            if (document.ToString().Contains("IWMStdReportProduction"))
            {
                productionOrder = (reportRequest as ReportProduction).ProductionOrder;
                // MSXXX per ora non riceviamo il ReceiptNumber (devono controllare se sia corretto cosi'
                /* if (string.IsNullOrEmpty(document.Descendants().FirstOrDefault(p => p.Name.LocalName == "ReceiptNumber").Value))
                {
                    return new InforResult(true, "ReceiptNumber non presente per l'ordine: " + (reportRequest as ReportProduction).ProductionOrder.Trim());
                }
                // per ora InforCallSucceded = false da verificare PRXXX
                else */
                if (document.Descendants().FirstOrDefault(p => p.Name.LocalName == "OutData").Value.StartsWith("1,99") == false)
                {
                    return new InforResult(false, "Campo OutData non ha stringa iniziale 1,99 per l'ordine: " + (reportRequest as ReportProduction).ProductionOrder.Trim());
                }
            }
            else if (document.ToString().Contains("IWMStdUnplannedMatlIssue"))
            {
                if(reportRequest is UnplannedMat)
                {
                    productionOrder = (reportRequest as UnplannedMat).ProdOrder;
                }
                else
                {
                    productionOrder = (reportRequest as List<UnplannedMat>).First().ProdOrder;
                }
                
                if (string.IsNullOrEmpty(document.Descendants().FirstOrDefault(p => p.Name.LocalName == "RunNumber").Value))
                {
                    return new InforResult(true, "RunNumber non presente per l'ordine " + (reportRequest as UnplannedMat).ProdOrder.Trim());
                }
                // per ora InforCallSucceded = false da verificare PRXXX
                else if (document.Descendants().FirstOrDefault(p => p.Name.LocalName == "OutData").Value.StartsWith("1,99") == false)
                {
                    return new InforResult(false, "Campo OutData non ha stringa iniziale 1,99 per l'ordine:  " + (reportRequest as UnplannedMat).ProdOrder.Trim());
                }
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
                if (string.IsNullOrEmpty(document.Descendants().FirstOrDefault(p => p.Name.LocalName == "QuantityCompleted").Value))
                {
                    return new InforResult(true, "QuantityCompleted non presente per l'ordine " + (reportRequest as OperatorOperation).ProdOrder.Trim());
                }
                else if (Convert.ToInt32(document.Descendants().FirstOrDefault(p => p.Name.LocalName == "QuantityCompleted").Element("Value").Value) < (reportRequest as OperatorOperation).Quantity)
                {
                    return new InforResult(false, "Risposta errata per l'ordine " + (reportRequest as OperatorOperation).ProdOrder.Trim() + "  la quantità completata è minore della quantità inviata");
                }
            }
            else
            {
                return new InforResult(false, "Risposta non contiene stringa metodo chiamante");
            }

            return new InforResult(true, string.Empty);
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

        public static InforResult ReportConsumedMaterials(List<UnplannedMat> unplannedMats)
        {
            var result = new InforResult();

            try
            {
                result = InforConnector.CallWebService(unplannedMats);

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
