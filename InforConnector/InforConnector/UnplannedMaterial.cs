using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InforConnectorLibrary
{
    public class UnplannedMat
    {
        public int Company { get; set; }

        public string ProcessingScope { get; set; }

        public string ProdOrder { get; set; }

        public int Operation { get; set; }

        public string Item { get; set; }

        public string Warehouse { get; set; }

        public decimal Quantity { get; set; }

        public string Unit { get; set; }

        public string GenerateOutbound { get; set; }

        public string ReleaseOutbound { get; set; }

        public string LoginCode { get; set; }

        public UnplannedMat(string erpOrder, int operationSequence, string consumedMaterialDefinition,
                                 int consumedMaterialSequence, decimal consumedQuantity, int company = 100,
                                 string processingScope = "request", string warehouse = "D100", string unit = "NR",
                                 string generateOutbound = "no", string releaseOutbound = "no",
                                 string loginCode = "extcdm")
        {
            ProdOrder = erpOrder;

            Operation = operationSequence;

            Item = consumedMaterialDefinition;

            // ?? = consumedMaterialSequence;

            Quantity = consumedQuantity;

            Company = company;

            ProcessingScope = processingScope;

            Warehouse = warehouse;

            Unit = unit;

            GenerateOutbound = generateOutbound;

            ReleaseOutbound = releaseOutbound;
            
            LoginCode = loginCode;
        }
    }
}
