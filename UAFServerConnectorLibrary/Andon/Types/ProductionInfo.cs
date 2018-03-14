using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Engineering.DAB.Andon.Types
{
    public class ProductionInfo
    {
        public string var_name { get; set; }
        public string line_description { get; set; }
        public int shift_total_production { get; set; }
        public int shift_actual_production { get; set; }
        public int shift_delay_production { get; set; }
        public int team { get; set; }
        public string order_product { get; set; }
        public string order_product_description { get; set; }
        public int order_total { get; set; }
        public int order_actual { get; set; }
        public string order_customer { get; set; }
    }
}
