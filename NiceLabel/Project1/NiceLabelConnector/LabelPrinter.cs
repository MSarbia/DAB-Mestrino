using NiceLabelConnector.NiceLabelService;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace NiceLabelConnector
{
    public static class LabelPrinter
    {
        private const string NiceLabelWebSrviTrgConfig = "NiceLabelService_WebSrviTrg";
        public static bool PrintSNLabel(List<string> serialNumbers)
        {
            //EndpointAddress address = new EndpointAddress("http://localhost:57676/PrintServiceMock.asmx");
            //var config = ConfigurationManager.GetSection("system.serviceModel/bindings") as
            //            System.ServiceModel.Configuration.BindingsSection;
            //BasicHttpBinding binding = new BasicHttpBinding("BasicHttpBinding_WebSrviTrg")/* { UseDefaultWebProxy = false, ProxyAddress = new Uri("http://ipv4.fiddler:8888") }*/;
            XmlDocument doc = new XmlDocument();
            XmlCDataSection CData;
            
            string text = @"<nice_commands quit=""false""><label name=""SNLabel"" close=""true""><session_print_job skip=""0"" job_name=""JOBNAME1""><session quantity=""n""><variable name=""ProductionLineId"">Linea1</variable><variable name=""FinalProductCode"">JET50xyz</variable><variable name=""ERPOrderId"">Order123456</variable><variable name=""SerialNumbers"">SN1,SN2,SN3,..,SNn</variable></session></session_print_job></label></nice_commands>";
            CData = doc.CreateCDataSection(text);
            string error;
            using (var client = new WebSrviTrgClient(NiceLabelWebSrviTrgConfig))
            {
                //NiceLabelConnector.NiceLabelService.ExecuteTriggerRequest inValue = new NiceLabelConnector.NiceLabelService.ExecuteTriggerRequest();
                //inValue.text = text;
                //inValue.wait = false;
                //var response = client.ExecuteTrigger(inValue);

                //error = response.errorText;
                client.ExecuteTrigger(text, false, out error);
            }

            return string.IsNullOrEmpty(error);
        }

    }
}
