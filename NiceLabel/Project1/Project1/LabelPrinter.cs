using Project1.NiceLabelService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.Text;
using System.Threading.Tasks;

namespace Project1
{
    public static class LabelPrinter
    {
		public static bool PrintSNLabel(List<string> serialNumbers)
        {
            EndpointAddress address = new EndpointAddress("http://localhost:57676/PrintServiceMock.asmx");
            Binding binding = new BasicHttpBinding();
            string text = @"<![CDATA[<?xml version=""1.0"" standalone='no'?><nice_commands quit=""false""><label name=""SNLabel"" close=""true""><session_print_job skip=""0"" job_name=""JOBNAME1""><session quantity=""n""><variable name=""ProductionLineId"">Linea1</variable><variable name=""FinalProductCode"">JET50xyz</variable><variable name=""ERPOrderId"">Order123456</variable><variable name=""SerialNumbers"">SN1,SN2,SN3,..,SNn</variable></session></session_print_job></label></nice_commands>]]>";
            string error;
            using (var client = new WebSrviTrgClient(binding, address))
            {
                
                client.ExecuteTrigger(text, false, out error);
            }

            return string.IsNullOrEmpty(error);
        }

    }
}
