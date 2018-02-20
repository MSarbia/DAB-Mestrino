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
        public int Company { get; set; }

        public string ProdOrder { get; set; }

        public int Operation { get; set; }

        public int Quantity { get; set; }

        public string UoM { get; set; }

        public string ProcessingScope { get; set; }

        public string OperationStatus { get; set; }

        public OperatorOperation(string erpOrder, int operationSequence, int producedQuantity,
                                  int company = 100,string processingScope="request",
                                  bool operationStaus= false)
        {
            ProdOrder = erpOrder;

            Operation = operationSequence;

            Quantity = producedQuantity;

            Company = company;

            ProcessingScope = processingScope;

            UoM = "NR";

            OperationStatus = operationStaus == false ? "" : "Completed";
        }
    }
}
