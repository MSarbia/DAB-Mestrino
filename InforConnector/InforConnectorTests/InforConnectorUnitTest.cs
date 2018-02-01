using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using InforConnectorLibrary;
using System.Xml;
using System.Net;

namespace InforConnectorTests
{
    [TestClass]
    public class InforConnectorUnitTest
    {
       
        [TestMethod]

        public void CreateWebRequestTestUnit()
        {
            // HttpWebRequest CreateWebRequest(string url, string action, out InforResult createWebRequestResult)

            InforResult result = new InforResult();

            var _url = "http://192.168.1.31:8312/c4ws/services/IWMStdReportProduction/lntestclone";

            PrivateType testClients = new PrivateType(typeof(InforConnector));

            object[] par = new object[] { _url,"TestAction" ,result };

            HttpWebRequest req= (testClients.InvokeStatic("CreateWebRequest", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Static, par)) as HttpWebRequest;

            Assert.AreEqual(true,((par[2]) as InforResult).InforCallSucceeded);
            Assert.AreEqual("CreateWebRequest: Web request creata con successo", ((par[2]) as InforResult).Error);
        }
    }
}
