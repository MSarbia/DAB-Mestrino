using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using InforConnectorLibrary;

namespace InforConnectorTests
{
    [TestClass]
    public class UnplannedMateriaUnitTest
    {
        [TestMethod]
        public void UnplannedMaterial()
        {
            UnplannedMat unPlan = new UnplannedMat("Erp_Order", 10, "ConsumedMatDef", 20, Convert.ToDecimal(1.0));
            Assert.AreEqual(unPlan.ProdOrder, "Erp_Order");
            Assert.AreEqual(unPlan.Operation, 10);
            Assert.AreEqual(unPlan.Item, "ConsumedMatDef");
            Assert.AreEqual(unPlan.Position,20);
            Assert.AreEqual(unPlan.Quantity,Convert.ToDecimal(1.0));

        }

        public void UnplannedMaterialComplete()
        {
            UnplannedMat unPlan = new UnplannedMat("Erp_Order", 10, "ConsumedMatDef", 20, Convert.ToDecimal(1.0),200,"NoRequest","E200","yes","yes");
            Assert.AreEqual(unPlan.ProdOrder, "Erp_Order");
            Assert.AreEqual(unPlan.Operation, 10);
            Assert.AreEqual(unPlan.Item, "ConsumedMatDef");
            Assert.AreEqual(unPlan.Position, 20);
            Assert.AreEqual(unPlan.Quantity, Convert.ToDecimal(1.0));
            Assert.AreEqual(unPlan.Company, 200);
            Assert.AreEqual(unPlan.ProcessingScope, "NoRequest");
            Assert.AreEqual(unPlan.Warehouse, "E200");
            Assert.AreEqual(unPlan.GenerateOutbound, "yes");
            Assert.AreEqual(unPlan.ReleaseOutbound, "yes");

        }
    }
}
