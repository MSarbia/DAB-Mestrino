using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InforConnectorLibrary
{
    //Attenzione, il nome della classe è utilizzato nella ricerca del metodo da chiamare nel dictionary 
    public class UnplannedMat
    {
        public int Company { get; set; }

        public string ProcessingScope { get; set; }

        public string ProdOrder { get; set; }

        public int Operation { get; set; }

        public bool Customized { get; set; }

        public string Item { get; set; }

        public string Warehouse { get; set; }

        public decimal Quantity { get; set; }

        public int Position  { get; set; }

        public string Unit { get; set; }

        public string GenerateOutbound { get; set; }

        public string ReleaseOutbound { get; set; }

        public string LoginCode { get; set; }
        public string Location { get; set; }

        public UnplannedMat(string erpOrder, int operationSequence, string consumedMaterialDefinition,
                                 int consumedMaterialSequence, decimal consumedQuantity, int company = 100,
                                 string processingScope = "request", string warehouse = "D100",
                                 string generateOutbound = "yes", string releaseOutbound = "yes")
        {
            ProdOrder = erpOrder;

            Operation = operationSequence;

            Item = consumedMaterialDefinition;

            Customized = false;

            Quantity = consumedQuantity;

            Position = consumedMaterialSequence;

            Company = company;

            ProcessingScope = processingScope;

            Warehouse = warehouse;

            Location = "PREL100";

            GenerateOutbound = generateOutbound;

            ReleaseOutbound = releaseOutbound;
        }
    }
}
