using System.Collections.Generic;
namespace Engineering.DAB.Andon.Types
{
    public enum alerttype
    {
        BadgeMissing = 1,
        Screwdriver,
        Operator,
        TicketNOK,
        Electric,
        Mechanical
    }
    public enum alertstatus
    {
        LineNotWorking = 1,
        OperatorTeamSpeackerAlertActive,
        MaintenanceAlertActive,
        PlannedAction,
        MaintenanceOperatorWorking,
        OPEquipmentDegraded
    }
    public class eachAlert
    {
        public string line { get; set; }
        public string unit { get; set; }
        public alerttype type { get; set; }
        public alertstatus status { get; set; }
        public string timestamp { get; set; }
        public int order { get; set; }
    }
    public class VisualAlerts
    {
        public string var_name { get; set; }
        public List<eachAlert> alerts { get; set; }
    }
}