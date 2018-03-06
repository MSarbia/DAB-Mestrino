using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InforConnectorLibrary
{
    //Attenzione, il nome della classe è utilizzato nella ricerca del metodo da chiamare nel dictionary 
    public class OperatorOperation  // Classe per gestire Operation Progress
    {
        public string Company { get; set; }

        public string ProdOrder { get; set; }

        public int Operation { get; set; }

        public int Quantity { get; set; }

        public string UoM { get; set; }

        public string ProcessingScope { get; set; }

        public string OperationStatus { get; set; }

        public OperatorOperation(string erpOrder, int operationSequence, int producedQuantity,
                                  string company,
                                  bool completed = false)
        {
            ProdOrder = erpOrder;

            Operation = operationSequence;

            Quantity = producedQuantity;

            Company = string.IsNullOrEmpty(company) ? "100" : company;

            ProcessingScope = "request";

            UoM = "NR";

            OperationStatus = completed ? "Completed" : string.Empty;
        }
    }
}
