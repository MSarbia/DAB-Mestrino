using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace UAFClientConnectorLibrary
{
    public static class CertificationManager
    {
        /// <summary>
        /// Load x.509 certificate, it is assumed that the certificate is installed 
        /// on the LocalMachine account under the Personal store
        /// </summary>
        /// <param name="moduleName">Unique identifier of the project for which the certificate is valid</param>
        /// <returns>Certificates</returns>
        private static X509Certificate2Collection GetCertficate(string moduleName)
        {
            X509Certificate2Collection certificates = null;

            var store = new X509Store(StoreName.My, StoreLocation.LocalMachine);

            store.Open(OpenFlags.ReadOnly);

            try
            {
                certificates = store.Certificates.Find(X509FindType.FindByIssuerDistinguishedName, moduleName, false);
            }
            catch (CryptographicException) { }

            return certificates;
        }

        /// <summary>
        /// Check if a certificate is not expired
        /// </summary>
        /// <param name="certificateCollection">Collection of certificates</param>
        /// <param name="certificate">The valid certificate</param>
        /// <returns>If certificate is valid</returns>
        private static bool IsValidCertificate(X509Certificate2Collection certificateCollection,
            out X509Certificate2 certificate)
        {
            certificate = null;
            var result = false;

            if (certificateCollection != null && certificateCollection.Count > 0)
            {
                foreach (var cert in certificateCollection)
                {
                    if (cert.NotAfter > DateTime.Now)
                    {
                        certificate = cert;
                        result = true;
                    }
                }
            }

            return result;
        }

        /// <summary>
        /// Get the valid certificate
        /// </summary>
        /// <param name="modulename">Name of the module</param>
        /// <param name="certificate">The valid certificate</param>
        /// <returns>If exists a valid certificate</returns>
        public static bool GetCertificate(string modulename, out X509Certificate2 certificate)
        {
            certificate = null;

            var certificates = GetCertficate(modulename);

            return IsValidCertificate(certificates, out certificate);
        }

    }
}
