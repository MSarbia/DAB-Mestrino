﻿using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Security;
using System.Text;
using System.Threading.Tasks;

namespace UAFServerConnectorLibrary
{
    public class TokenManager
    {
        public TokenManager()
        {
            this._hostName = Dns.GetHostEntry(Environment.MachineName).HostName;
            if (this._hostName.Contains("."))
                this._hostName = this._hostName.Remove(this._hostName.IndexOf("."));
            this._domain = Environment.UserDomainName;
            this._loggedUserName = Environment.UserName;
            this._loggedUserPassword = "SwqaMe$1";
            this._startReq = "http://" + this._hostName + "/sit-auth/OAuth/Authorize?client_id=Siemens.SimaticIt.SolutionStudio&redirect_uri=http://" + this._hostName + "/sit-ui/system/Studio/default.html&response_type=token&scope=read&state=14326517343870.9801154530141503";
        }

        public TokenManager(string UserName, string UserPW, string Domain, string HostUnified = null)
        {
            if (HostUnified != null)
            {
                this._hostName = HostUnified;
                //TestHelper.HostUnified = this._hostName;
            }
            else
                this._hostName = Dns.GetHostEntry(Environment.MachineName).HostName;
            this._domain = Domain;
            this._loggedUserName = UserName;
            this._loggedUserPassword = UserPW;
            this._startReq = "http://" + this._hostName + "/sit-auth/OAuth/Authorize?client_id=123&redirect_uri=http://" + this._hostName + "/sit-ui/system/Studio/default.html&response_type=token&scope=read&state=14326517343870.9801154530141503";
        }

        public TokenManager(string HostName, string UserName, string UserPW, string StartReq, string Domain)
        {
            this._hostName = HostName;
            this._domain = Domain;
            this._loggedUserName = UserName;
            this._loggedUserPassword = UserPW;
            this._startReq = StartReq;
        }

        public string _tokenRenewal { get; private set; }

        public string _hostName { get; set; }

        public string _domain { get; set; }

        public string _loggedUserName { get; set; }

        public string _loggedUserPassword { get; set; }

        public string _startReq { get; set; }

        public string GetTokenFromRequest()
        {
            return this.GetTokenFromRequest(false);
        }

        public string GetTokenFromRequestSSL()
        {
            return this.GetTokenFromRequest(true);
        }

        private string GetTokenFromRequest(bool ssl)
        {
            string requestUri = (ssl ? "https" : "http") + "://" + this._hostName + "/sit-auth/OAuth/token";
            ServicePointManager.ServerCertificateValidationCallback += (RemoteCertificateValidationCallback)((sender, cert, chain, sslPolicyErrors) => true);
            string userName = string.IsNullOrEmpty(this._domain) ? this._loggedUserName:this._domain + "\\" + this._loggedUserName;
            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.ASCII.GetBytes(string.Format("{0}:{1}", (object)"clientID", (object)"clientPsw"))));
                Dictionary<string, string> dictionary = new Dictionary<string, string>()
        {
          {
            "grant_type",
            "password"
          },
          {
            "username",
            userName
          },
          {
            "password",
            this._loggedUserPassword
          },
          {
            "scope",
            "global"
          }
        };
                HttpResponseMessage result = httpClient.PostAsync(requestUri, (HttpContent)new FormUrlEncodedContent((IEnumerable<KeyValuePair<string, string>>)dictionary)).Result;
                HttpStatusCode statusCode = result.StatusCode;
                if (!statusCode.Equals((object)HttpStatusCode.Found))
                {
                    statusCode = result.StatusCode;
                    if (!statusCode.Equals((object)HttpStatusCode.OK))
                        throw new Exception("TokenNotFound");
                }
                return JObject.Parse(result.Content.ReadAsStringAsync().Result).Value<string>("access_token");
            }
        }

        public string RetrieveParameterFromHeader(HttpWebResponse Response, string CustomHeader)
        {
            return Response.Headers[CustomHeader];
        }

        public Cookie RetrieveCookieFromResponse(string CookieString)
        {
            string[] strArray = CookieString.Split(new char[2]
            {
        ';',
        '='
            });
            return new Cookie()
            {
                Name = strArray[0],
                Value = strArray[1],
                Path = "/",
                HttpOnly = true,
                Domain = this._hostName
            };
        }

        public HttpWebResponse HttpGetMethod(string RequestUri, string GetReferer, CookieContainer RetrievedCookies)
        {
            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(RequestUri);
            httpWebRequest.Method = "GET";
            httpWebRequest.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
            httpWebRequest.Headers.Add("Accept-Language: it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4");
            httpWebRequest.Referer = GetReferer;
            httpWebRequest.CookieContainer = new CookieContainer();
            httpWebRequest.CookieContainer = RetrievedCookies;
            httpWebRequest.AllowAutoRedirect = false;
            return (HttpWebResponse)httpWebRequest.GetResponse();
        }

        public HttpWebResponse HttpPostMethod(string RequestUri, string PostReferer, byte[] PostBytes, CookieContainer RetrievedCookies)
        {
            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(RequestUri);
            httpWebRequest.ContentType = "application/x-www-form-urlencoded";
            httpWebRequest.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
            httpWebRequest.Headers.Add("Accept-Language: it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4");
            httpWebRequest.Method = "POST";
            httpWebRequest.Referer = PostReferer;
            httpWebRequest.AllowAutoRedirect = false;
            httpWebRequest.CookieContainer = new CookieContainer();
            httpWebRequest.CookieContainer = RetrievedCookies;
            Stream requestStream = httpWebRequest.GetRequestStream();
            requestStream.Write(PostBytes, 0, PostBytes.Length);
            requestStream.Flush();
            requestStream.Close();
            return (HttpWebResponse)httpWebRequest.GetResponse();
        }

        private static string CheckIfFound(string ResponseData, HttpWebResponse ResponseWeb)
        {
            if (!ResponseWeb.StatusCode.Equals((object)HttpStatusCode.Found) && !ResponseWeb.StatusCode.Equals((object)HttpStatusCode.OK))
                throw new Exception("Token not found");
            Stream responseStream = ResponseWeb.GetResponseStream();
            StreamReader streamReader = new StreamReader(responseStream);
            ResponseData = streamReader.ReadToEnd();
            streamReader.Close();
            responseStream.Close();
            return ResponseData;
        }

        private void ResponseParamCleanUp(List<AuthResponse> HtmlUMCParamList, ref string HeadingValues, ref byte[] BytesToPost, HttpWebResponse Response)
        {
            HtmlUMCParamList.Clear();
            HeadingValues = string.Empty;
            BytesToPost = new byte[0];
            Response.Close();
        }
    }

    public class AuthResponse
    {
        public string _name { get; set; }

        public string _tagName { get; set; }

        public string _attributeName { get; set; }

        public string _attributeToRetrieve { get; set; }

        public string _value { get; private set; }

        public string SetValueRetrieved(string Value)
        {
            this._value = Value;
            return this._value;
        }
    }
}
