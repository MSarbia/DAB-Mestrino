using System.Collections.Generic;

namespace Engineering.DAB.Andon.Types
{
    class AndonData
    {
        public string ProductionLineId { get; set; }
        public ProductionCounters ProductionCounters { get; set; }
        public ProductionOrder CurrentOrder { get; set; }
        public ProductionOrder NextOrder { get; set; }
        public List<EquipmentStatus> ProductionLineStatus { get; set; }
        public VisualAlerts VisualAlerts { get; set; }
        public Defects Defects { get; set; }
    }
}
