﻿using System;
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

        public string FromWarehouse { get; set; }
        public string FromLocation { get; set; }

        public string OrderNumber { get; set; }

        public string StorageUnit { get; set; }

        public decimal StorageQuantity { get; set; }

        public string Item { get; set; }

        public string OrderType { get; set; }

        public bool Customized { get; set; }
        public string Company { get; internal set; }

        public InvTransfer(string orderNumber,
                           string refNum,
                           string storageUnit,
                           decimal storageQuantity, string company, string item, bool customized)
        {
            OrderNumber = orderNumber;

            Item = item;
            ToWarehouse = string.Empty;
            FromWarehouse = "D100";
            FromLocation = "PREL100";
            Company = string.IsNullOrEmpty(company) ? "100" : company;
            Customized = customized;
            if (string.IsNullOrEmpty(refNum) == false)
            {
                var splitted = refNum.Split('-');

                if (splitted.Count() == 2)
                {
                    OrderType = splitted[0];
                    ToWarehouse = splitted[1];
                }
            }
            StorageUnit = storageUnit;
            StorageQuantity = storageQuantity;
        }
    }
}
