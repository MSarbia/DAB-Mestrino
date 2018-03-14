namespace Engineering.DAB.Andon.Types
{
    public class ProductionOrder
    {
        public string OrderId { get; set; }
        public string FinishedProductCode { get; set; }
        public string FinishedProductDescription { get; set; }
        public int OrderQty { get; set; }
        public int? PallettizedQty { get; set; }
        public int? ReworkedQty { get; set; }
    }
}