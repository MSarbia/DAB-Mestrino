using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InforConnectorLibrary
{
    public class OperationProgress
    {
        public int Company { get; set; }

        public string ProdOrder { get; set; }

        public int Operation { get; set; }

        public int Quantity { get; set; }

        public OperationProgress(string erpOrder, int operationSequence, int producedQuantity, int company = 100)
        {
            ProdOrder = erpOrder;

            Operation = operationSequence;

            Quantity = producedQuantity;

            Company = company;
        }
    }
}
