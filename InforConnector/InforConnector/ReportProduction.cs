using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InforConnectorLibrary
{
    //Attenzione, il nome della classe è utilizzato nella ricerca del metodo da chiamare nel dictionary 
    public class ReportProduction
    {
        public int Company { get; set; }

        public string ProcessingScope { get; set; }

        public string ProductionOrder { get; set; }

        public int QtyDeliver { get; set; }

        public string ReportPrevious { get; set; }

        public string BackFlush { get; set; }

        public string DirectReceipt { get; set; }

        public string Complete { get; set; }

        public string ReportMore { get; set; }    

        public ReportProduction(string erpOrder, int producedQuantity, bool closeOrder, int company = 100, 
                                string processingScope = "request", string reportPrevious = "yes",
                                string backFlush = "yes", string directReceipt = "yes", string reportMore = "no")
        {
            ProductionOrder = erpOrder;

            QtyDeliver = producedQuantity;

            Complete = closeOrder == true ? "yes" : "no";

            Company = company;

            ProcessingScope = processingScope;

            ReportPrevious = reportPrevious;

            BackFlush = backFlush;

            DirectReceipt = directReceipt;

            ReportMore = reportMore;
        }
    }
}
