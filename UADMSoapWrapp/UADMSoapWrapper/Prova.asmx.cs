using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Xml.Serialization;

namespace UADMSoapWrapper
{
    /// <summary>
    /// Summary description for Prova
    /// </summary>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("wsdl", "4.6.1590.0")]
    [System.Web.Services.WebServiceBindingAttribute(Name = "IWMStdReportProductionSoapBinding", Namespace = "http://www.infor.com/businessinterface/IWMStdReportProduction")]
    [System.Xml.Serialization.XmlIncludeAttribute(typeof(FilterType))]
    [System.Xml.Serialization.XmlIncludeAttribute(typeof(Message))]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class Prova : System.Web.Services.WebService, IIWMStdReportProductionSoapBinding
    {
        //[System.Web.Services.WebMethodAttribute()]
        //[System.Web.Services.Protocols.SoapRpcMethodAttribute("", RequestNamespace = "http://www.infor.com/businessinterface/IWMStdReportProduction", ResponseNamespace = "http://www.infor.com/businessinterface/IWMStdReportProduction", Use = System.Web.Services.Description.SoapBindingUse.Literal)]
        //[return: System.Xml.Serialization.XmlElementAttribute("ReportProductionResponse")]
        public ReportProductionResponseType ReportProduction(ReportProductionRequestType ReportProductionRequest)
        {
            throw new NotImplementedException();
        }
    }
}
