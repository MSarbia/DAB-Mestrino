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
        public string Company { get; set; }

        public string ProcessingScope { get; set; }

        public string FromWarehouse { get; set; }

        public string ProductionOrder { get; set; }

        public int QtyDeliver { get; set; }

        public string ReportPrevious { get; set; }

        public string BackFlush { get; set; }

        public string DirectReceipt { get; set; }

        public string Complete { get; set; }

        public string ReportMore { get; set; }

        public ReportProduction(string erpOrder, bool closeOrder, string company, string warehouse)
        {
            FromWarehouse = string.IsNullOrEmpty(warehouse) ? "D110" : warehouse;
            ProductionOrder = erpOrder;

            QtyDeliver = 0;

            Complete = closeOrder == true ? "yes" : "no";

            Company = string.IsNullOrEmpty(company) ? "100" : company;

            ProcessingScope = "request";

            ReportPrevious = "yes";

            BackFlush = "yes";

            DirectReceipt = "yes";

            ReportMore = "no";
        }
    }
}
