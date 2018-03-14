using System.Collections.Generic;

namespace Engineering.DAB.Andon.Types
{
    public class AndonData
    {
        public AndonData()
        {
            ListProductionInfo = new List<ProductionInfo>();
            ListKPI = new List<KPI>();
            ListVisualAlerts = new List<VisualAlerts>();

        }
        public List<ProductionInfo> ListProductionInfo { get; set; }

        public List<KPI> ListKPI { get; set; }
        public List<VisualAlerts> ListVisualAlerts { get; set; }
    }
}
