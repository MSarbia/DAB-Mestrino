﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace NiceLabelConnector.ServiceReference1 {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="ServiceReference1.WebSrviTrg")]
    public interface WebSrviTrg {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/WebSrviTrg/ExecuteTrigger", ReplyAction="http://tempuri.org/WebSrviTrg/ExecuteTriggerResponse")]
        [System.ServiceModel.XmlSerializerFormatAttribute(Style=System.ServiceModel.OperationFormatStyle.Rpc, SupportFaults=true, Use=System.ServiceModel.OperationFormatUse.Encoded)]
        NiceLabelConnector.ServiceReference1.ExecuteTriggerResponse ExecuteTrigger(NiceLabelConnector.ServiceReference1.ExecuteTriggerRequest request);
        
        // CODEGEN: Generating message contract since the operation has multiple return values.
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/WebSrviTrg/ExecuteTrigger", ReplyAction="http://tempuri.org/WebSrviTrg/ExecuteTriggerResponse")]
        System.Threading.Tasks.Task<NiceLabelConnector.ServiceReference1.ExecuteTriggerResponse> ExecuteTriggerAsync(NiceLabelConnector.ServiceReference1.ExecuteTriggerRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/WebSrviTrg/ExecuteTriggerWithResponse", ReplyAction="http://tempuri.org/WebSrviTrg/ExecuteTriggerWithResponseResponse")]
        [System.ServiceModel.XmlSerializerFormatAttribute(Style=System.ServiceModel.OperationFormatStyle.Rpc, SupportFaults=true, Use=System.ServiceModel.OperationFormatUse.Encoded)]
        NiceLabelConnector.ServiceReference1.ExecuteTriggerWithResponseResponse ExecuteTriggerWithResponse(NiceLabelConnector.ServiceReference1.ExecuteTriggerWithResponseRequest request);
        
        // CODEGEN: Generating message contract since the operation has multiple return values.
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/WebSrviTrg/ExecuteTriggerWithResponse", ReplyAction="http://tempuri.org/WebSrviTrg/ExecuteTriggerWithResponseResponse")]
        System.Threading.Tasks.Task<NiceLabelConnector.ServiceReference1.ExecuteTriggerWithResponseResponse> ExecuteTriggerWithResponseAsync(NiceLabelConnector.ServiceReference1.ExecuteTriggerWithResponseRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/WebSrviTrg/ExecuteTriggerAndSetVariables", ReplyAction="http://tempuri.org/WebSrviTrg/ExecuteTriggerAndSetVariablesResponse")]
        [System.ServiceModel.XmlSerializerFormatAttribute(Style=System.ServiceModel.OperationFormatStyle.Rpc, SupportFaults=true, Use=System.ServiceModel.OperationFormatUse.Encoded)]
        NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesResponse ExecuteTriggerAndSetVariables(NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesRequest request);
        
        // CODEGEN: Generating message contract since the operation has multiple return values.
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/WebSrviTrg/ExecuteTriggerAndSetVariables", ReplyAction="http://tempuri.org/WebSrviTrg/ExecuteTriggerAndSetVariablesResponse")]
        System.Threading.Tasks.Task<NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesResponse> ExecuteTriggerAndSetVariablesAsync(NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/WebSrviTrg/ExecuteTriggerAndSetVariablesWithResponse", ReplyAction="http://tempuri.org/WebSrviTrg/ExecuteTriggerAndSetVariablesWithResponseResponse")]
        [System.ServiceModel.XmlSerializerFormatAttribute(Style=System.ServiceModel.OperationFormatStyle.Rpc, SupportFaults=true, Use=System.ServiceModel.OperationFormatUse.Encoded)]
        NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesWithResponseResponse ExecuteTriggerAndSetVariablesWithResponse(NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesWithResponseRequest request);
        
        // CODEGEN: Generating message contract since the operation has multiple return values.
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/WebSrviTrg/ExecuteTriggerAndSetVariablesWithResponse", ReplyAction="http://tempuri.org/WebSrviTrg/ExecuteTriggerAndSetVariablesWithResponseResponse")]
        System.Threading.Tasks.Task<NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesWithResponseResponse> ExecuteTriggerAndSetVariablesWithResponseAsync(NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesWithResponseRequest request);
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.MessageContractAttribute(WrapperName="ExecuteTrigger", WrapperNamespace="http://tempuri.org/", IsWrapped=true)]
    public partial class ExecuteTriggerRequest {
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=0)]
        public string text;
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=1)]
        public bool wait;
        
        public ExecuteTriggerRequest() {
        }
        
        public ExecuteTriggerRequest(string text, bool wait) {
            this.text = text;
            this.wait = wait;
        }
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.MessageContractAttribute(WrapperName="ExecuteTriggerResponse", WrapperNamespace="http://tempuri.org/", IsWrapped=true)]
    public partial class ExecuteTriggerResponse {
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=0)]
        public int ExecuteTriggerResult;
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=1)]
        public string errorText;
        
        public ExecuteTriggerResponse() {
        }
        
        public ExecuteTriggerResponse(int ExecuteTriggerResult, string errorText) {
            this.ExecuteTriggerResult = ExecuteTriggerResult;
            this.errorText = errorText;
        }
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.MessageContractAttribute(WrapperName="ExecuteTriggerWithResponse", WrapperNamespace="http://tempuri.org/", IsWrapped=true)]
    public partial class ExecuteTriggerWithResponseRequest {
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=0)]
        public string text;
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=1)]
        public bool wait;
        
        public ExecuteTriggerWithResponseRequest() {
        }
        
        public ExecuteTriggerWithResponseRequest(string text, bool wait) {
            this.text = text;
            this.wait = wait;
        }
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.MessageContractAttribute(WrapperName="ExecuteTriggerWithResponseResponse", WrapperNamespace="http://tempuri.org/", IsWrapped=true)]
    public partial class ExecuteTriggerWithResponseResponse {
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=0)]
        public int ExecuteTriggerWithResponseResult;
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=1)]
        [System.Xml.Serialization.SoapElementAttribute(DataType="base64Binary")]
        public byte[] responseData;
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=2)]
        public string errorText;
        
        public ExecuteTriggerWithResponseResponse() {
        }
        
        public ExecuteTriggerWithResponseResponse(int ExecuteTriggerWithResponseResult, byte[] responseData, string errorText) {
            this.ExecuteTriggerWithResponseResult = ExecuteTriggerWithResponseResult;
            this.responseData = responseData;
            this.errorText = errorText;
        }
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.MessageContractAttribute(WrapperName="ExecuteTriggerAndSetVariables", WrapperNamespace="http://tempuri.org/", IsWrapped=true)]
    public partial class ExecuteTriggerAndSetVariablesRequest {
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=0)]
        public string text;
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=1)]
        public string variableData;
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=2)]
        public bool wait;
        
        public ExecuteTriggerAndSetVariablesRequest() {
        }
        
        public ExecuteTriggerAndSetVariablesRequest(string text, string variableData, bool wait) {
            this.text = text;
            this.variableData = variableData;
            this.wait = wait;
        }
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.MessageContractAttribute(WrapperName="ExecuteTriggerAndSetVariablesResponse", WrapperNamespace="http://tempuri.org/", IsWrapped=true)]
    public partial class ExecuteTriggerAndSetVariablesResponse {
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=0)]
        public int ExecuteTriggerAndSetVariablesResult;
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=1)]
        public string errorText;
        
        public ExecuteTriggerAndSetVariablesResponse() {
        }
        
        public ExecuteTriggerAndSetVariablesResponse(int ExecuteTriggerAndSetVariablesResult, string errorText) {
            this.ExecuteTriggerAndSetVariablesResult = ExecuteTriggerAndSetVariablesResult;
            this.errorText = errorText;
        }
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.MessageContractAttribute(WrapperName="ExecuteTriggerAndSetVariablesWithResponse", WrapperNamespace="http://tempuri.org/", IsWrapped=true)]
    public partial class ExecuteTriggerAndSetVariablesWithResponseRequest {
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=0)]
        public string text;
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=1)]
        public string variableData;
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=2)]
        public bool wait;
        
        public ExecuteTriggerAndSetVariablesWithResponseRequest() {
        }
        
        public ExecuteTriggerAndSetVariablesWithResponseRequest(string text, string variableData, bool wait) {
            this.text = text;
            this.variableData = variableData;
            this.wait = wait;
        }
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.MessageContractAttribute(WrapperName="ExecuteTriggerAndSetVariablesWithResponseResponse", WrapperNamespace="http://tempuri.org/", IsWrapped=true)]
    public partial class ExecuteTriggerAndSetVariablesWithResponseResponse {
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=0)]
        public int ExecuteTriggerAndSetVariablesWithResponseResult;
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=1)]
        [System.Xml.Serialization.SoapElementAttribute(DataType="base64Binary")]
        public byte[] responseData;
        
        [System.ServiceModel.MessageBodyMemberAttribute(Namespace="", Order=2)]
        public string errorText;
        
        public ExecuteTriggerAndSetVariablesWithResponseResponse() {
        }
        
        public ExecuteTriggerAndSetVariablesWithResponseResponse(int ExecuteTriggerAndSetVariablesWithResponseResult, byte[] responseData, string errorText) {
            this.ExecuteTriggerAndSetVariablesWithResponseResult = ExecuteTriggerAndSetVariablesWithResponseResult;
            this.responseData = responseData;
            this.errorText = errorText;
        }
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface WebSrviTrgChannel : NiceLabelConnector.ServiceReference1.WebSrviTrg, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class WebSrviTrgClient : System.ServiceModel.ClientBase<NiceLabelConnector.ServiceReference1.WebSrviTrg>, NiceLabelConnector.ServiceReference1.WebSrviTrg {
        
        public WebSrviTrgClient() {
        }
        
        public WebSrviTrgClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public WebSrviTrgClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public WebSrviTrgClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public WebSrviTrgClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        [System.ComponentModel.EditorBrowsableAttribute(System.ComponentModel.EditorBrowsableState.Advanced)]
        NiceLabelConnector.ServiceReference1.ExecuteTriggerResponse NiceLabelConnector.ServiceReference1.WebSrviTrg.ExecuteTrigger(NiceLabelConnector.ServiceReference1.ExecuteTriggerRequest request) {
            return base.Channel.ExecuteTrigger(request);
        }
        
        public int ExecuteTrigger(string text, bool wait, out string errorText) {
            NiceLabelConnector.ServiceReference1.ExecuteTriggerRequest inValue = new NiceLabelConnector.ServiceReference1.ExecuteTriggerRequest();
            inValue.text = text;
            inValue.wait = wait;
            NiceLabelConnector.ServiceReference1.ExecuteTriggerResponse retVal = ((NiceLabelConnector.ServiceReference1.WebSrviTrg)(this)).ExecuteTrigger(inValue);
            errorText = retVal.errorText;
            return retVal.ExecuteTriggerResult;
        }
        
        public System.Threading.Tasks.Task<NiceLabelConnector.ServiceReference1.ExecuteTriggerResponse> ExecuteTriggerAsync(NiceLabelConnector.ServiceReference1.ExecuteTriggerRequest request) {
            return base.Channel.ExecuteTriggerAsync(request);
        }
        
        [System.ComponentModel.EditorBrowsableAttribute(System.ComponentModel.EditorBrowsableState.Advanced)]
        NiceLabelConnector.ServiceReference1.ExecuteTriggerWithResponseResponse NiceLabelConnector.ServiceReference1.WebSrviTrg.ExecuteTriggerWithResponse(NiceLabelConnector.ServiceReference1.ExecuteTriggerWithResponseRequest request) {
            return base.Channel.ExecuteTriggerWithResponse(request);
        }
        
        public int ExecuteTriggerWithResponse(string text, bool wait, out byte[] responseData, out string errorText) {
            NiceLabelConnector.ServiceReference1.ExecuteTriggerWithResponseRequest inValue = new NiceLabelConnector.ServiceReference1.ExecuteTriggerWithResponseRequest();
            inValue.text = text;
            inValue.wait = wait;
            NiceLabelConnector.ServiceReference1.ExecuteTriggerWithResponseResponse retVal = ((NiceLabelConnector.ServiceReference1.WebSrviTrg)(this)).ExecuteTriggerWithResponse(inValue);
            responseData = retVal.responseData;
            errorText = retVal.errorText;
            return retVal.ExecuteTriggerWithResponseResult;
        }
        
        public System.Threading.Tasks.Task<NiceLabelConnector.ServiceReference1.ExecuteTriggerWithResponseResponse> ExecuteTriggerWithResponseAsync(NiceLabelConnector.ServiceReference1.ExecuteTriggerWithResponseRequest request) {
            return base.Channel.ExecuteTriggerWithResponseAsync(request);
        }
        
        [System.ComponentModel.EditorBrowsableAttribute(System.ComponentModel.EditorBrowsableState.Advanced)]
        NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesResponse NiceLabelConnector.ServiceReference1.WebSrviTrg.ExecuteTriggerAndSetVariables(NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesRequest request) {
            return base.Channel.ExecuteTriggerAndSetVariables(request);
        }
        
        public int ExecuteTriggerAndSetVariables(string text, string variableData, bool wait, out string errorText) {
            NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesRequest inValue = new NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesRequest();
            inValue.text = text;
            inValue.variableData = variableData;
            inValue.wait = wait;
            NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesResponse retVal = ((NiceLabelConnector.ServiceReference1.WebSrviTrg)(this)).ExecuteTriggerAndSetVariables(inValue);
            errorText = retVal.errorText;
            return retVal.ExecuteTriggerAndSetVariablesResult;
        }
        
        public System.Threading.Tasks.Task<NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesResponse> ExecuteTriggerAndSetVariablesAsync(NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesRequest request) {
            return base.Channel.ExecuteTriggerAndSetVariablesAsync(request);
        }
        
        [System.ComponentModel.EditorBrowsableAttribute(System.ComponentModel.EditorBrowsableState.Advanced)]
        NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesWithResponseResponse NiceLabelConnector.ServiceReference1.WebSrviTrg.ExecuteTriggerAndSetVariablesWithResponse(NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesWithResponseRequest request) {
            return base.Channel.ExecuteTriggerAndSetVariablesWithResponse(request);
        }
        
        public int ExecuteTriggerAndSetVariablesWithResponse(string text, string variableData, bool wait, out byte[] responseData, out string errorText) {
            NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesWithResponseRequest inValue = new NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesWithResponseRequest();
            inValue.text = text;
            inValue.variableData = variableData;
            inValue.wait = wait;
            NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesWithResponseResponse retVal = ((NiceLabelConnector.ServiceReference1.WebSrviTrg)(this)).ExecuteTriggerAndSetVariablesWithResponse(inValue);
            responseData = retVal.responseData;
            errorText = retVal.errorText;
            return retVal.ExecuteTriggerAndSetVariablesWithResponseResult;
        }
        
        public System.Threading.Tasks.Task<NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesWithResponseResponse> ExecuteTriggerAndSetVariablesWithResponseAsync(NiceLabelConnector.ServiceReference1.ExecuteTriggerAndSetVariablesWithResponseRequest request) {
            return base.Channel.ExecuteTriggerAndSetVariablesWithResponseAsync(request);
        }
    }
}
