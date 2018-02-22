using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAFClientConnectorLibrary.DataTypes
{
    public class TestResultParameter
    {
        public TestResultParameter()
        {
            Assorbimenti = new List<AbsorptionResultParameter>();
            DescrizioneEsito = string.Empty;
        }
        
        public List<AbsorptionResultParameter> Assorbimenti { get; set; }
        
        public decimal? CorrenteDiTerra { get; set; }
        
        public decimal? CorrenteRigidita { get; set; }
        
        public string DescrizioneEsito { get; set; }
        
        public string Esito { get; set; }
        
        public decimal? ResistenzaDiTerra { get; set; }
        
        public decimal? ResistenzaIsolamento { get; set; }
        
        public string SerialNumber { get; set; }
        
        public decimal? TensioneIsolamento { get; set; }
        
        public decimal TensioneRigidita { get; set; }
    }
}
