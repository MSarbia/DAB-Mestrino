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
        public class Error
        {
            public string error;
            public bool connectionsucceeded;
            public Error(){
                error = "";
                connectionsucceeded = true;
            }
            internal void setError(bool succeeded,string er)
            {
                error = er;
                connectionsucceeded = succeeded;
            }

        }


        private const string NiceLabelWebSrviTrgConfig = "NiceLabelService_WebSrviTrg";

        static string startXml()
        {
            string header= "<NICELABEL_JOB><MES_LABEL_DATA>";

            return header;
        }
        static string endXml()
        {
            string footer = "</MES_LABEL_DATA></NICELABEL_JOB>";

            return footer;
        }

        private static Error PrintLabel(List<string> serialNumbers,string productCode,string workArea, string labelType,int quantity)
        {
            try { 
            XmlDocument doc = new XmlDocument();
            XmlCDataSection CData;

            string text = "";
            text = text + startXml();   

            if (serialNumbers.Count < 1) { serialNumbers.Add(""); }

            foreach (string serialNumber in serialNumbers)
            {              
                text = text + "<item>";
                text = text + string.Format("<Codice_prodotto>{0}</Codice_prodotto>", productCode);
                text = text + string.Format("<Numero_seriale>{0}</Numero_seriale>", serialNumber);
                text = text + string.Format("<Tipologia_etichetta>{0}</Tipologia_etichetta>", labelType);
                text = text + string.Format("<Linea>{0}</Linea>", workArea);
                text = text + string.Format("<Quantita_copie>{0}</Quantita_copie>", quantity);
                text = text + "</item>";
            }

            text = text + endXml();
                Console.WriteLine(quantity);
            CData = doc.CreateCDataSection(text);
            string error;
            using (var client = new WebSrviTrgClient(NiceLabelWebSrviTrgConfig))
            {
                client.ExecuteTrigger(text, false, out error);
            }
                Error er = new Error();

                if (!string.IsNullOrEmpty(error)) er.setError(false, error);
                return er;
            }
            catch(Exception e)
            {
                Error er = new Error();
                er.setError(true,e.Message );
                return er;
            }
        }


        public static Error PrintSNLabel(List<string> serialNumbers, string productCode, string workArea, int quantity = 1)
        {
            return PrintLabel(serialNumbers, productCode, workArea, "SNLabel",quantity);
        }
        public static Error PrintDataLabel(List<string> serialNumbers, string productCode, string workArea, int quantity = 1)
        {
            return PrintLabel(serialNumbers, productCode, workArea, "DataLabel", quantity);
        }
        public static Error PrintPackageLabel(List<string> serialNumbers, string productCode, string workArea, int quantity = 1)
        {
            return PrintLabel(serialNumbers, productCode, workArea, "PackageLabel", quantity);
        }
        public static Error PrintPalletLabel(List<string> serialNumbers, string productCode, string workArea, int quantity = 1)
        {
            return PrintLabel(serialNumbers, productCode, workArea, "PalletLabel", quantity);
        }




    }
}
