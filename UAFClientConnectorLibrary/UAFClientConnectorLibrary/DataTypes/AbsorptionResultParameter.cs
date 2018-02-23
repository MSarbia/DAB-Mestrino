using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAFClientConnectorLibrary.DataTypes
{

    public class AbsorptionResultParameter
    {
        public AbsorptionResultParameter()
        {

        }
        
        public decimal? AmpereFase1 { get; set; }
        
        public decimal? AmpereFase2 { get; set; }
       
        public decimal? AmpereFase3 { get; set; }
       
        public decimal FattoreDiPotenza { get; set; }
       
        public string Nome { get; set; }
       
        public decimal? Portata { get; set; }
       
        public decimal Watt { get; set; }
       
        public decimal? Pressione { get; set; }
        
        public decimal SquilibrioCorrenti { get; set; }
      
        public decimal? TensioneProva { get; set; }
    }
}