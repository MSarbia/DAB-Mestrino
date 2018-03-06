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
        public string Company { get; set; }

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

        public UnplannedMat(string erpOrder, int operationSequence, string consumedMaterialDefinition, bool customized,
                                 int consumedMaterialSequence, decimal consumedQuantity, string unit, string company)
        {
            ProdOrder = erpOrder;

            Operation = operationSequence;

            Item = consumedMaterialDefinition;

            Unit = unit;

            Customized = customized;

            Quantity = consumedQuantity;

            Position = consumedMaterialSequence;

            Company = company;

            ProcessingScope = "request";

            Warehouse = "D100";

            Location = "PREL100";

            GenerateOutbound = "yes";

            ReleaseOutbound = "yes";
        }
    }
}
