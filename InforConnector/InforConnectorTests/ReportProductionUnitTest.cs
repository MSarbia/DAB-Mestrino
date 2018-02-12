using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using InforConnectorLibrary;

namespace InforConnectorTests
{
    [TestClass]
    public class ReportProductionUnitTest
    {
        /* unit test code
        [TestMethod] 
        public void Debit_WithValidAmount_UpdatesBalance() 
        { // arrange double beginningBalance = 11.99; 
        double debitAmount = 4.55; 
        double expected = 7.44; 
        BankAccount account = new BankAccount("Mr. Bryan Walton", beginningBalance);
        // act account.Debit(debitAmount); 
        // assert double actual = account.Balance;
        Assert.AreEqual(expected, actual, 0.001, "Account not debited correctly"); }
        */
        [TestMethod]
        public void ReportProduction()
        {
            ReportProduction rp = new ReportProduction("Erp_Order", 1, true);

            Assert.AreEqual(rp.ProductionOrder, "Erp_Order");
            Assert.AreEqual(rp.QtyDeliver, 1);
            Assert.AreEqual(rp.Complete, "yes");

            ReportProduction rp2 = new ReportProduction("Erp_Order", 1, true,200,"processScope","no","no","no","yes");

            Assert.AreEqual(rp2.ProductionOrder, "Erp_Order");
            Assert.AreEqual(rp2.QtyDeliver, 1);
            Assert.AreEqual(rp2.Company, 200);
            Assert.AreEqual(rp2.ProcessingScope, "processScope");
            Assert.AreEqual(rp2.ReportPrevious, "no");
            Assert.AreEqual(rp2.BackFlush, "no");
            Assert.AreEqual(rp2.DirectReceipt, "no");
            Assert.AreEqual(rp2.ReportMore, "yes");
        }
    }
}
