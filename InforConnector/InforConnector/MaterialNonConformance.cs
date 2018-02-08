using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InforConnectorLibrary
{
    //Attenzione, il nome della classe è utilizzato nella ricerca del metodo da chiamare nel dictionary 
    public class InvTransfer     // Classe per gestire MaterialNonConformance
    {
        public int Company { get; set; }

        public string ProcessingScope { get; set; }

        public string Item { get; set; }

        public string FromWarehouse { get; set; }

        public string ToWarehouse { get; set; }

        public string FromLocation { get; set; }

        public string ToLocation { get; set; }

        public string StorageUnit { get; set; }

        public decimal StorageQuantity { get; set; }

        public InvTransfer(string consumedMaterialDefinition,
                                      decimal nonConformantQuantity,
                                      string nonConformantQuantityUnit,
                                      int company = 100, string processingScope = "request",
                                      string fromWarehouse = "AD0001", string toWarehouse = "AD0001",
                                      string fromLocation = "A-01-01-01", string toLocation = "A-01-01-02")
        {
            Item = consumedMaterialDefinition;

            StorageUnit = nonConformantQuantityUnit;

            StorageQuantity = nonConformantQuantity;

            Company = company;

            ProcessingScope = processingScope;

            FromWarehouse = fromWarehouse;

            ToWarehouse = toWarehouse;

            FromLocation = FromLocation;

            ToLocation = ToLocation;
        }
    }
}
