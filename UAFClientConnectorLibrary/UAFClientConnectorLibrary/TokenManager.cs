using System;
using System.IdentityModel.Protocols.WSTrust;
using System.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;

namespace UAFClientConnectorLibrary
{
    public static class TokenManager
    {

        /*
        /// <summary>
        /// Create X.509 signed token
        /// </summary>
        /// <param name="x509Certificate2Collection">Array of certificates</param>
        /// <returns>Authentication token</returns>
        public static string GetToken(X509Certificate2Collection x509Certificate2Collection)
        {
            var token = string.Empty;

            var now = DateTime.UtcNow;

            var tokenHandler = new JwtSecurityTokenHandler();

            var certificate = x509Certificate2Collection[0];

            Logger.WriteLog(Logger.PLMLogEvent.Info, "Start retrieving token");

            try
            {
                var x509SigningCredentials = new X509SigningCredentials(certificate);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject =
                        new ClaimsIdentity(
                            new[]
                            {
                                new Claim(ClaimTypes.Name, certificate.Issuer),
                                new Claim(ClaimTypes.Thumbprint, certificate.Thumbprint),
                                new Claim("urn:realm", "x.509"),
                            }),
                    TokenIssuerName = "urn:unifiedoauth",
                    AppliesToAddress = "urn:unified",
                    Lifetime = new Lifetime(now.AddMinutes(-2), now.AddMinutes(15)),
                    SigningCredentials = x509SigningCredentials
                };

                var securityToken = tokenHandler.CreateToken(tokenDescriptor);

                token = tokenHandler.WriteToken(securityToken);

            }
            catch (ArgumentNullException)
            {
                return string.Empty;
            }
            catch (ArgumentException)
            {
                return string.Empty;
            }

            Logger.WriteLog(Logger.PLMLogEvent.Info, "Token retrieved");

            return token;
        }
        */

        /// <summary>
        /// Create X.509 signed token
        /// </summary>
        /// <param name="x509Certificate2Collection">Array of certificates</param>
        /// <param name="token">Authentication token</param>
        /// <param name="tokenvalidity">Expiration time (minutes)</param>
        /// <returns>If request succeed</returns>
        public static bool GetToken(X509Certificate2 certificate, int tokenvalidity, out string token)
        {
            token = string.Empty;

            var now = DateTime.UtcNow;

            var tokenHandler = new JwtSecurityTokenHandler();

            //Logger.WriteLog(Logger.PLMLogEvent.Info, "Start retrieving token");

            try
            {
                var x509SigningCredentials = new X509SigningCredentials(certificate);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject =
                        new ClaimsIdentity(
                            new[]
                            {
                                new Claim(ClaimTypes.Name, certificate.Issuer),
                                new Claim(ClaimTypes.Thumbprint, certificate.Thumbprint),
                                new Claim("urn:realm", "x.509"),
                                new Claim("urn:originator", "AppDAB")
                            }),
                    TokenIssuerName = "urn:unifiedoauth",
                    AppliesToAddress = "urn:unified",
                    Lifetime = new Lifetime(now.AddMinutes(-2), now.AddMinutes(tokenvalidity)),
                    SigningCredentials = x509SigningCredentials
                };

                var securityToken = tokenHandler.CreateToken(tokenDescriptor);

                token = tokenHandler.WriteToken(securityToken);

            }
            catch (ArgumentNullException)
            {
                return false;
            }
            catch (ArgumentException)
            {
                return false;
            }

            //Logger.WriteLog(Logger.PLMLogEvent.Info, "Token retrieved, exspires in " + tokenvalidity + " minutes");

            return true;
        }

    }
}
