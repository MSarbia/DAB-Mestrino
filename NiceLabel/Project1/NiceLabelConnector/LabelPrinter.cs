using NiceLabelConnector.NiceLabelService;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace NiceLabelConnector
{
    public static class LabelPrinter
    {
        private const string NiceLabelWebSrviTrgConfig = "NiceLabelService_WebSrviTrg";

        static string startXml()
        {
            string header= "<NICELABEL_JOB>" + Environment.NewLine + "<MES_LABEL_DATA>" + Environment.NewLine;

            return header;
        }
        static string endXml()
        {
            string footer = Environment.NewLine + "</MES_LABEL_DATA>" + Environment.NewLine + "</NICELABEL_JOB>";

            return footer;
        }

        //          SNLabel
        //        DataLabel
        //       PackageLabel
        //        PalletLabel

        private static bool PrintLabel(List<string> serialNumbers,string productCode,string workArea, string labelType,int quantity)
        {
            XmlDocument doc = new XmlDocument();
            XmlCDataSection CData;

            string text = "";
            text = text + startXml();   

            if (serialNumbers.Count < 1) { serialNumbers.Add(""); }

            foreach (string serialNumber in serialNumbers)
            {
                text = text + "<item>" + Environment.NewLine;
                text = text + string.Format("<Codice_prodotto>{0}</Codice_prodotto>", productCode) + Environment.NewLine;
                text = text + string.Format("<Numero_seriale>{0}</Numero_seriale>", serialNumber) + Environment.NewLine;
                text = text + string.Format("<Tipologia_etichetta>{0}</Tipologia_etichetta>", labelType) + Environment.NewLine;
                text = text + string.Format("<Linea>{0}</Linea>", workArea) + Environment.NewLine;
                text = text + string.Format("<Quantita_copie>{0}</Quantita_copie>", quantity) + Environment.NewLine;
                text = text + "</item>" + Environment.NewLine;
            }

            text = text + endXml();

            CData = doc.CreateCDataSection(text);
            string error;
            using (var client = new WebSrviTrgClient(NiceLabelWebSrviTrgConfig))
            {
                client.ExecuteTrigger(text, false, out error);
            }

            return string.IsNullOrEmpty(error);
        }


        public static bool PrintSNLabel(List<string> serialNumbers, string productCode, string workArea, int quantity = 1)
        {
            return PrintLabel(serialNumbers, productCode, workArea, "SNLabel",quantity);
        }
        public static bool PrintDataLabel(List<string> serialNumbers, string productCode, string workArea, int quantity = 1)
        {
            return PrintLabel(serialNumbers, productCode, workArea, "DataLabel", quantity);
        }
        public static bool PrintPackageLabel(List<string> serialNumbers, string productCode, string workArea, int quantity = 1)
        {
            return PrintLabel(serialNumbers, productCode, workArea, "PackageLabel", quantity);
        }
        public static bool PrintPalletLabel(List<string> serialNumbers, string productCode, string workArea, int quantity = 1)
        {
            return PrintLabel(serialNumbers, productCode, workArea, "PalletLabel", quantity);
        }




    }
}
