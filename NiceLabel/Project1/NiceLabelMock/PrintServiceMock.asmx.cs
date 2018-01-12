using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace NiceLabelMock
{
    /// <summary>
    /// Summary description for PrintServiceMock
    /// </summary>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("wsdl", "4.6.1590.0")]
    [System.Web.Services.WebServiceAttribute(Namespace = "http://tempuri.org/")]
    [System.Web.Services.WebServiceBindingAttribute(Name = "BasicHttpBinding_WebSrviTrg", Namespace = "http://tempuri.org/")]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class PrintServiceMock :WebServiceContract
    {
        [System.Web.Services.WebMethodAttribute()]
        [System.Web.Services.Protocols.SoapRpcMethodAttribute("http://tempuri.org/WebSrviTrg/ExecuteTrigger", RequestNamespace = "http://tempuri.org/", ResponseNamespace = "http://tempuri.org/")]
        public override int ExecuteTrigger(string text, bool wait, out string errorText)
        {
            int result = 0;
            try
            {
                XElement contacts = XElement.Parse(text);
                errorText = string.Empty;
            }
            catch (System.Xml.XmlException e)
            {
                errorText = e.ToString();
                result = -1;
            }
            return result;
        }

        [System.Web.Services.WebMethodAttribute()]
        [System.Web.Services.Protocols.SoapRpcMethodAttribute("http://tempuri.org/WebSrviTrg/ExecuteTriggerAndSetVariables", RequestNamespace = "http://tempuri.org/", ResponseNamespace = "http://tempuri.org/")]
        public override int ExecuteTriggerAndSetVariables(string text, string variableData, bool wait, out string errorText)
        {
            throw new NotImplementedException();
        }

        [System.Web.Services.WebMethodAttribute()]
        [System.Web.Services.Protocols.SoapRpcMethodAttribute("http://tempuri.org/WebSrviTrg/ExecuteTriggerAndSetVariablesWithResponse", RequestNamespace = "http://tempuri.org/", ResponseNamespace = "http://tempuri.org/")]
        public override int ExecuteTriggerAndSetVariablesWithResponse(string text, string variableData, bool wait, [SoapElement(DataType = "base64Binary")] out byte[] responseData, out string errorText)
        {
            throw new NotImplementedException();
        }


        [System.Web.Services.WebMethodAttribute()]
        [System.Web.Services.Protocols.SoapRpcMethodAttribute("http://tempuri.org/WebSrviTrg/ExecuteTriggerWithResponse", RequestNamespace = "http://tempuri.org/", ResponseNamespace = "http://tempuri.org/")]
        public override int ExecuteTriggerWithResponse(string text, bool wait, [SoapElement(DataType = "base64Binary")] out byte[] responseData, out string errorText)
        {
            throw new NotImplementedException();
        }
    }
}
