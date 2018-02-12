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
        public string ToWarehouse { get; set; }

        public string OrderNumber { get; set; }

        public string StorageUnit { get; set; }

        public decimal StorageQuantity { get; set; }

        public string TransId { get; set; }

        public InvTransfer(string orderNumber,
                           string refNum,
                           string storageUnit,
                           decimal storageQuantity)
        {
            OrderNumber = orderNumber;

            TransId = string.Empty;
            ToWarehouse = string.Empty;

            if (string.IsNullOrEmpty(refNum) == false)
            {
                var splitted = refNum.Split(';');

                if (splitted.Count() == 2)
                {
                    TransId = splitted[0];

                    ToWarehouse = splitted[1];
                }

            }

            StorageUnit = storageUnit;

            StorageQuantity = storageQuantity;
        }
    }
}
