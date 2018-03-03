using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Engineering.DAB.Andon.Types
{
    public class KPI
    {
        public string var_name { get; set; }
        public string description { get; set; }
        public int defect_per_shift { get; set; }
        public int defect_min_shift { get; set; }
        public int defect_max_shift { get; set; }
        public int rework_per_shift { get; set; }
        public int rework_min_shift { get; set; }
        public int rework_max_shift { get; set; }
        public int OEE_per_shift { get; set; }
        public int OEE_min_shift { get; set; }
        public int OEE_max_shift { get; set; }
        public int LE_per_shift { get; set; }
        public int LE_min_shift { get; set; }
        public int LE_max_shift { get; set; }
    }
}
