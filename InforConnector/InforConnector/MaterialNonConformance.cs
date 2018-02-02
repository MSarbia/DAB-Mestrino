using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InforConnectorLibrary
{
    //Attenzione, il nome della classe è utilizzato nella ricerca del metodo da chiamare nel dictionary 
    public class MaterialNonConformance
    {
        public int Company { get; set; }

        public string ProductionOrder { get; set; }

        public MaterialNonConformance(string erpOrder, int operationSequence, string consumedMaterialDefinition,
                                      int consumedMaterialSequence, decimal nonConformantQuantity,  int company = 100)
        {

            ProductionOrder = erpOrder;

            // ??? = operationSequence;

            // ??? = consumedMaterialDefinition;

            // ??? = consumedMaterialSequence;

            // ??? = nonConformantQuantity;

            Company = company;
        }
    }
}
