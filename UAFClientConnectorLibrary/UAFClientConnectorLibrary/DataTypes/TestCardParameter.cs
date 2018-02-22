using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAFClientConnectorLibrary.DataTypes
{
    public class TestCardParameter
    {
        public TestCardParameter()
        { }

        public List<AbsorptionParameter> Assorbimenti { get; set; }

        public string CodiceProdotto { get; set; }

        public decimal? CorrenteASecco { get; set; }

        public decimal? CorrenteASeccoPercent { get; set; }

        public decimal? PotenzaASecco { get; set; }

        public decimal? PotenzaASeccoPercent { get; set; }
    }
}
