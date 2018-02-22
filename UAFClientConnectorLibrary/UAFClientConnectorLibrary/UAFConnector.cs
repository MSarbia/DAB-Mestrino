using System;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using UAFClientConnectorLibrary.DataTypes;

namespace UAFClientConnectorLibrary
{
    public class UAFConnector
    {
        /// <summary>
        /// Instance of the certification
        /// </summary>
        private X509Certificate2 x509Certificate = null;

        /// <summary>
        /// Authentication token
        /// </summary>
        private string AuthToken = string.Empty;

        /// <summary>
        /// Machien to invoke to call the command
        /// </summary>
        private static string UAFServerName = string.Empty;

        /// <summary>
        /// Protocol http\https for GET
        /// </summary>
        private static string Protocol = "http";

        /// <summary>
        /// Certification module name
        /// </summary>
        private static string CertificateModuleName = string.Empty;

        /// <summary>
        /// Max number of attempt to retrieve the token
        /// </summary>
        private static readonly int MaxRetryAttempt = 2;

        /// <summary>
        /// Expiration time of the token
        /// </summary>
        private static int TokenValidity = 150;

        private static string AppName = string.Empty;

        static UAFConnector()
        {
            ExeConfigurationFileMap map = new ExeConfigurationFileMap();
            map.ExeConfigFilename = "UAFClientConnectorLibrary.dll.config";

            Configuration libConfig = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);

            AppSettingsSection section = (libConfig.GetSection("appSettings") as AppSettingsSection);

            AppName = section.Settings["AppName"].Value;
            UAFServerName = section.Settings["UAFServerName"].Value;
            CertificateModuleName = section.Settings["CertificateModuleName"].Value;
        }

        /// <summary>
        /// Initialize the Command Invoker
        /// </summary>
        /// <param name="targetMachineName">Target machine to call the command</param>
        /// <param name="certificateModuleName">Name of the certification module</param>
        /// <param name="protocol">HTTP protocol http\https</param>
        /// <returns>If authentication succeed</returns>
        public bool Initialize()
        {
            return this.Authenticate();
        }

        /// <summary>
        /// Perform the authentication
        /// </summary>
        /// <param name="force">If true request for a new token</param>
        /// <returns>If authentication succeed</returns>
        private bool Authenticate(bool force = false)
        {
            var certificationIsValid = true;

            if (this.x509Certificate == null)
            {
                certificationIsValid = CertificationManager.GetCertificate(CertificateModuleName, out this.x509Certificate);
            }

            if (certificationIsValid)
            {
                if (this.AuthToken == string.Empty || force)
                {
                    if (!TokenManager.GetToken(x509Certificate, TokenValidity, out this.AuthToken))
                    {
                        //Logger.WriteLog(Logger.PLMLogEvent.Error, "Cannot retrieve the authentication token");
                        return false;
                    }
                }
            }
            else
            {
                //Logger.WriteLog(Logger.PLMLogEvent.Error, "Not found a valid certificate");
                return false;
            }

            return true;
        }

        /// <summary>
        /// Call the command via http request
        /// </summary>
        /// <param name="cmdName">Name of command</param>
        /// <param name="cmdSl">Arguments of the command</param>
        /// <param name="token">Authentication token</param>
        /// <param name="appname">Application name</param>
        /// <param name="resultServiceLayer">Content result</param>
        /// <returns>Response message</returns>
        private HttpResponseMessage HttpCallCommand(string cmdName, string cmdSl, string token, out string resultServiceLayer)
        {
            var client = new HttpClient { Timeout = new TimeSpan(0, 30, 0) };
            var createUri = string.Format(Protocol + "://" + UAFServerName + "/sit-svc/application/{0}/odata/{1}", AppName, cmdName);

            SetHtttpClientHeaders(token, client, createUri);

            var task = client.PostAsync(string.Empty, new StringContent(cmdSl, Encoding.UTF8, "application/json"));

            var response = task.Result;

            resultServiceLayer = response.Content.ReadAsStringAsync().Result;

            return response;
        }


        /// <summary>
        /// Call the command via http request
        /// </summary>
        /// <param name="commandName">Name of command</param>
        /// <param name="commandInput">Arguments of the command</param>
        /// <returns>Response message string</returns>
        public string HttpCallCommand(string commandName, string commandInput)
        {
            string response;
            HttpCallCommand(commandName,"{ command: " + commandInput + "}", this.AuthToken, out response);

            return response;
        }

        /// <summary>
        /// Set the header of the client
        /// </summary>
        /// <param name="token">Authentication token</param>
        /// <param name="client">Http client</param>
        /// <param name="createUri">Target URI</param>
        private void SetHtttpClientHeaders(string token, HttpClient client, string createUri)
        {
            client.BaseAddress = new Uri(createUri);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }


        public static DABGetTestCard.Response StaticDABGetTestCard(string serialNumber)
        {
            UAFConnector connector = new UAFConnector();
            connector.Initialize();
            return connector.DABGetTestCard(serialNumber);
        }

        public DABGetTestCard.Response DABGetTestCard(string serialNumber)
        {
            var command = new DABGetTestCard { SerialNumber = serialNumber };
            return CallCommand<DABGetTestCard, DABGetTestCard.Response>(command.CommandFullName, command);
        }

        public static DABSendTestResult.Response StaticDABSendTestResult(TestResultParameter testResult)
        {
            UAFConnector connector = new UAFConnector();
            connector.Initialize();
            return connector.DABSendTestResult(testResult);
        }

        public DABSendTestResult.Response DABSendTestResult(TestResultParameter testResult)
        {
            var command = new DABSendTestResult
            {
                Result = testResult
            };
            return CallCommand<DABSendTestResult, DABSendTestResult.Response>(command.CommandFullName, command);
        }


        /// <summary>
        /// Invokes the specified command.
        /// </summary>
        /// <typeparam name="TRequest">Specify the command to call</typeparam>
        /// <typeparam name="TResponse">Specify the response of the called command</typeparam>
        /// <param name="command">Specify command parameters.</param>
        /// <returns>Command execution response</returns>
        public TResponse CallCommand<TCommand, TResponse>(string commandName, TCommand command) where TResponse : BaseResponse,new()
        {
            var resultServiceLayer = string.Empty;

            var payload = "{ command: " + JSONSerializer.Serialize(command) + "}";

            HttpResponseMessage httpMessageResponse = null;

            var retryAttempt = 0;

            do
            {

                //Logger.WriteLog(Logger.PLMLogEvent.Info, "Call post command");

                httpMessageResponse = HttpCallCommand(commandName,
                    payload,
                    this.AuthToken,
                    out resultServiceLayer);

                //Logger.WriteLog(Logger.PLMLogEvent.Info, "Post command response: " + httpMessageResponse.StatusCode);

                if (httpMessageResponse.StatusCode == HttpStatusCode.Unauthorized)
                {
                    //Logger.WriteLog(Logger.PLMLogEvent.Info, "Get a new token");

                    retryAttempt++;
                    this.Authenticate(true);
                }

            }
            while (httpMessageResponse.StatusCode == HttpStatusCode.Unauthorized &&
            retryAttempt < MaxRetryAttempt);

            if(httpMessageResponse.StatusCode == HttpStatusCode.OK)
            {
                return JSONSerializer.Deserialize<TResponse>(resultServiceLayer);
            }
            else
            {
                try
                {
                    return JSONSerializer.Deserialize<TResponse>(resultServiceLayer);
                }
                catch(Exception)
                {
                    var response = new TResponse();
                    response.Succeeded = false;
                    response.Error = new ExecutionError
                    {
                        ErrorCode = (int)httpMessageResponse.StatusCode,
                        ErrorMessage = httpMessageResponse.ReasonPhrase
                    };
                    return response;
                }
            }
        }

    }

    /// <summary>
    /// Interface to implement for a new command
    /// </summary>
    //public interface IDISCommand
    //{
    //    /// <summary>
    //    /// Gets the full name of the command.
    //    /// </summary>
    //    string CommandFullName { get; }

    //    /// <summary>
    //    /// Gets the name of the App where the command is deployed.
    //    /// </summary>
    //    string CommandAppName { get; }

    //    /// <summary>
    //    /// Gets the payload to POST
    //    /// </summary>
    //    /// <returns>A string contaning the payload of the message</returns>
    //    string GetPayload();

    //    /// <summary>
    //    /// Get the response of the message
    //    /// </summary>
    //    /// <param name="message">Content message</param>
    //    /// <param name="statusCode">Http status code</param>
    //    /// <returns></returns>
    //    Response GetResponse(string message, HttpStatusCode statusCode);

    //}

    /// <summary>
    /// Represent a command response
    /// </summary>
    /// <typeparam name="T">Type IDISCommand</typeparam>
    //public abstract class DISResponse<T> : DISResponse where T : IDISCommand
    //{
    //    /// <summary>
    //    /// Initializes an instance of the Response class
    //    /// with default values.
    //    /// </summary>
    //    protected DISResponse()
    //    {
    //    }

    //    /// <summary>
    //    /// Initializes an instance of the Response class
    //    /// with a custom error.
    //    /// </summary>
    //    /// <param name="error">The custom error to be passed in the response.</param>
    //    protected DISResponse(string error)
    //    {
    //    }
    //}

    /// <summary>
    /// Provides a base response class for command responses
    /// </summary>
    //public abstract class Response
    //{

    //    public ResponseError Error { get; set; }

    //    /// <summary>
    //    /// Gets if the required command is completed with success.
    //    /// </summary>
    //    public bool Succeeded { get; set; }

    //    /// <summary>
    //    /// Initializes an instance of the Siemens.SimaticIT.Unified.Common.Response class
    //    //  with default values
    //    /// </summary>
    //    protected Response()
    //    {
    //        this.Error = new ResponseError();
    //    }

    //    /// <summary>
    //    /// Sets the custom error code and its associated message
    //    /// </summary>
    //    /// <param name="errorCode">Error code</param>
    //    /// <param name="errorMessage">Error message</param>
    //    public void SetError(int errorCode, string errorMessage)
    //    {
    //        this.Error.ErrorCode = errorCode;
    //        this.Error.ErrorDescription = errorMessage;
    //        this.Succeeded = false;
    //    }
    //}

    //public class ResponseError
    //{
    //    public int ErrorCode { get; set; }

    //    public string ErrorDescription { get; set; }

    //}

}
