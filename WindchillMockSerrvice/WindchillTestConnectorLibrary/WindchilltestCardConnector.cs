using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WindchillTestConnectorLibrary.WindchillTestCardService;

namespace WindchillTestConnectorLibrary
{
    public class WindchillTestCardConnector:IDisposable
    {
        private RMWebServicesImplClient _testClient;

        private string _userName = "wcadmin";
        private string _password = "DWTadmin";

        public WindchillTestCardConnector()
        {
            _testClient = new RMWebServicesImplClient("RMWebServicesImplPort");
            ExeConfigurationFileMap map = new ExeConfigurationFileMap();
            map.ExeConfigFilename = "WindchillTestConnectorLibrary.dll.config";

            Configuration libConfig = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);

            AppSettingsSection section = (libConfig.GetSection("appSettings") as AppSettingsSection);

            _userName = section.Settings["WindchillUser"].Value;
            _password = section.Settings["WindchillPassword"].Value;


            if (_testClient.ClientCredentials == null)
            {
                System.Diagnostics.Debug.WriteLine("Null ClientCredentials");
                return;
            }
            //_testClient.ClientCredentials.UseIdentityConfiguration = true;
            _testClient.ClientCredentials.UserName.UserName = _userName;
            _testClient.ClientCredentials.UserName.Password = _password;
        }

        public TestCardParameter GetTestCard(string productCode)
        {
            var testCard = new TestCardParameter
            {
                CodiceProdotto = productCode,
                Assorbimenti = new List<AbsorptionParameter>()
            };
           var genericBusinessObject = _testClient.Query(string.Empty, "intra.adw.industrialization_data", $"name='{productCode}'", string.Empty, new string[] { "*" });
            if (genericBusinessObject == null || genericBusinessObject.Length == 0 || !genericBusinessObject[0].properties.Any())
                return testCard;

            decimal? potenzaASecco = null;
            decimal? potenzaPercent = null;
            decimal? correnteASecco = null;
            decimal? amperePercent = null;
            decimal? pressionePercent = null;
            decimal? portataPercent = null;

            //power1y
            //Power1t
            //current1y
            //current1t
            //power1a
            //Power1t
            //current1a
            //current1t
            //head1a
            //head1t
            //flowrate1a
            //flowrate1t
            var absorptionDictionary = new Dictionary<string, AbsorptionParameter>();

            foreach (var kvp in genericBusinessObject[0].properties)
            {
                //kvp.
                decimal tempvalue = 0;
                string name = kvp.name.ToLowerInvariant();
                if (name == "power1y")
                {
                    potenzaASecco = decimal.TryParse(kvp.value, out tempvalue) ? tempvalue : (decimal?)null;
                }
                else if (name == "power1t")
                {
                    potenzaPercent = decimal.TryParse(kvp.value, out tempvalue) ? tempvalue : (decimal?)null;
                }
                else if (name == "current1y")
                {
                    correnteASecco = decimal.TryParse(kvp.value, out tempvalue) ? tempvalue : (decimal?)null;
                }
                else if (name == "current1t")
                {
                    amperePercent = decimal.TryParse(kvp.value, out tempvalue) ? tempvalue : (decimal?)null;
                }
                else if (name == "head1t")
                {
                    pressionePercent = decimal.TryParse(kvp.value, out tempvalue) ? tempvalue : (decimal?)null;
                }
                else if (name == "flowrate1t")
                {
                    portataPercent = decimal.TryParse(kvp.value, out tempvalue) ? tempvalue : (decimal?)null;
                }
                else if (name.StartsWith("power") && name.EndsWith("a"))
                {
                    string absorptionName = GetAbsorptionName(name);
                    if(!absorptionDictionary.ContainsKey(absorptionName))
                    {
                        absorptionDictionary.Add(absorptionName, new AbsorptionParameter());
                        absorptionDictionary[absorptionName].Nome = absorptionName;
                    }
                    absorptionDictionary[absorptionName].Watt = decimal.TryParse(kvp.value, out tempvalue) ? tempvalue : (decimal?)null;
                }
                else if (name.StartsWith("current") && name.EndsWith("a"))
                {
                    string absorptionName = GetAbsorptionName(name);
                    if (!absorptionDictionary.ContainsKey(absorptionName))
                    {
                        absorptionDictionary.Add(absorptionName, new AbsorptionParameter());
                        absorptionDictionary[absorptionName].Nome = absorptionName;
                    }
                    absorptionDictionary[absorptionName].Ampere = decimal.TryParse(kvp.value, out tempvalue) ? tempvalue : (decimal?)null;
                }
                else if (name.StartsWith("head") && name.EndsWith("a"))
                {
                    string absorptionName = GetAbsorptionName(name);
                    if (!absorptionDictionary.ContainsKey(absorptionName))
                    {
                        absorptionDictionary.Add(absorptionName, new AbsorptionParameter());
                        absorptionDictionary[absorptionName].Nome = absorptionName;
                    }
                    absorptionDictionary[absorptionName].Pressione = decimal.TryParse(kvp.value, out tempvalue) ? tempvalue : (decimal?)null;
                }
                else if (name.StartsWith("flowrate") && name.EndsWith("a"))
                {
                    string absorptionName = GetAbsorptionName(name);
                    if (!absorptionDictionary.ContainsKey(absorptionName))
                    {
                        absorptionDictionary.Add(absorptionName, new AbsorptionParameter());
                        absorptionDictionary[absorptionName].Nome = absorptionName;
                    }
                    absorptionDictionary[absorptionName].Portata = decimal.TryParse(kvp.value, out tempvalue) ? tempvalue : (decimal?)null;
                }
                else
                {
                    continue;
                }
            }
            testCard.CorrenteASecco = correnteASecco;
            testCard.PotenzaASecco = potenzaASecco;
            if(testCard.CorrenteASecco.HasValue)
            {
                testCard.CorrenteASeccoPercent = amperePercent;
            }
            if (testCard.PotenzaASecco.HasValue)
            {
                testCard.PotenzaASeccoPercent = potenzaPercent;
            }
            foreach(var abs in absorptionDictionary.Values)
            {
                if(abs.Ampere.HasValue)
                {
                    abs.AmperePercent = amperePercent;
                }
                if (abs.Portata.HasValue)
                {
                    abs.PortataPercent = portataPercent;
                }
                if (abs.Pressione.HasValue)
                {
                    abs.PressionePercent = pressionePercent;
                }
                if (abs.Watt.HasValue)
                {
                    abs.WattPercent = potenzaPercent;
                }
            }
            testCard.Assorbimenti.AddRange(absorptionDictionary.Values.OrderBy(a => a.Nome));

            return testCard;
        }

        string GetAbsorptionName(string propertyName)
        {
            string resultString = Regex.Match(propertyName, @"\d+").Value;
            return $"ASS{resultString}";
        }

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    ((IDisposable)_testClient).Dispose();
                }

                // TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
                // TODO: set large fields to null.

                disposedValue = true;
            }
        }

        // TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
        // ~WindchillDocConnector() {
        //   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
        //   Dispose(false);
        // }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
            // TODO: uncomment the following line if the finalizer is overridden above.
            // GC.SuppressFinalize(this);
        }
        #endregion
    }
}
