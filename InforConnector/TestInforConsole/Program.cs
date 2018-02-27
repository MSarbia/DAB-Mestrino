using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InforConnectorLibrary;
using System.Net;
using System.Xml.Linq;
using System.Xml;

namespace TestInforConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            var request = new OperatorOperation("",0,1,"100",false);
            InforResult r;
            XmlDocument soapEnvelopeXml = InforConnector.CreateSoapEnvelope(request, out r);

            InforResult createWebRequestResult = new InforResult();
            HttpWebRequest webRequest = InforConnector.CreateWebRequest("http://192.168.1.31:8312/c4ws/services/IWMStdReportProduction/lntestclone", "", out createWebRequestResult);

            InforConnector.ParseWebResponse(null, webRequest);
            string response = $@"<?xml version=""1.0""?>
                    <S:Envelope xmlns:S=""http://schemas.xmlsoap.org/soap/envelope/"">
                        <S:Body>
                            <ChangeResponse xmlns=""http://www.infor.com/businessinterface/SFCOperatorOperation"">
                                <ChangeResponse xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns="""">
                                    <DataArea>
                                        <SFCOperatorOperation>
                                            <ProductionOrderID>D01265725</ProductionOrderID>
                                            <OperationID>10</OperationID>
                                            <OperationStatus>Active</OperationStatus>
                                            <ActualProductionStartDate>2018-02-16T11:27:01Z</ActualProductionStartDate>
                                            <QuantityCompleted><Value>1</Value><UOM>NR</UOM></QuantityCompleted>
                                            <QuantityRejected><Value>0</Value><UOM>NR</UOM></QuantityRejected>
                                            <QuantityScrapped><Value>0</Value><UOM>NR</UOM></QuantityScrapped>
                                            <QuantityQuarantined><Value>0</Value><UOM>NR</UOM></QuantityQuarantined>
                                            <RemainingProductionTime><Value>0.1</Value><UOM>Hours</UOM></RemainingProductionTime>
                                            <PostToInventoryIndicator>true</PostToInventoryIndicator>
                                            <DirectReceiveIndicator>true</DirectReceiveIndicator>
                                        </SFCOperatorOperation>
                                    </DataArea>
                                </ChangeResponse>
                            </ChangeResponse>
                        </S:Body>
                    </S:Envelope>";

           

            Console.WriteLine("Selezionare richiesta:\n\n 1) Report Production\n 2) Unplanned Material\n 3) Material Non Conformance \n 4) Operation Progress\n");

            InforResult result = new InforResult();

            while (true)
            {
                int choice = Int32.Parse(Console.ReadLine());
                ReportProduction reportProd = new ReportProduction("D02220137", false,"100");
                UnplannedMat unplannedMat = new UnplannedMat("D02220137", 1, "002612155",true, 1, Convert.ToDecimal(1.0),"100");
                OperatorOperation operationProg = new OperatorOperation("D02220137", 1, 1,"100");
                InvTransfer materialNonConf = new InvTransfer("TestOrderNumber", "TransIdTest;ToWarehouseTest", "StorageUnitTest", Convert.ToDecimal(1.2),"100", "002612155", true);

                if ((choice > 0) && (choice < 5))
                {
                    if (choice == 1)
                    {
                        result = InforConnector.ReportProducedQuantity(reportProd);
                    }
                    else if (choice == 2)
                    {
                        result = InforConnector.ReportConsumedMaterial(unplannedMat);
                    }
                    else if (choice == 3)
                    {
                        result = InforConnector.ReportMaterialNonConformance(materialNonConf);
                    }
                    else if (choice == 4)
                    {
                        result = InforConnector.ReportOperationProgress(operationProg);
                    }

                    Console.WriteLine("Test passed : " + result.InforCallSucceeded.ToString() + " with message: " + result.Error);
                }
                else {
                    Console.WriteLine("\nScelta errata");
                }
            }
        }
    }
}
