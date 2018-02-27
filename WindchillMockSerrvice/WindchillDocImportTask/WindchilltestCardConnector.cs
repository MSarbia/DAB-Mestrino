using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindchillTestConnectorLibrary.WindchillTestCardService;

namespace WindchillDocImportTask
{
    public class WindchilltestCardConnector
    {
        private RMWebServicesImplClient _testClient;

        private string _userName = "wcadmin";
        private string _password = "DWTadmin";

        public WindchilltestCardConnector()
        {
            _testClient = new RMWebServicesImplClient("RMWebServicesImplPort");
            ExeConfigurationFileMap map = new ExeConfigurationFileMap();
            map.ExeConfigFilename = "WindchilltestCardConnectorLibrary.dll.config";

            Configuration libConfig = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);

            AppSettingsSection section = (libConfig.GetSection("appSettings") as AppSettingsSection);

            _userName = section.Settings["WindchillUser"].Value;
            _password = section.Settings["WindchillPassword"].Value;
            

            if (_testClient.ClientCredentials == null)
            {
                System.Diagnostics.Debug.WriteLine("Null ClientCredentials");
                return;
            }
            _testClient.ClientCredentials.UserName.UserName = _userName;
            _testClient.ClientCredentials.UserName.Password = _password;
        }

        public TestCard GetTestCard(string productCode)
        {
            var testCard = new TestCard();
           var genericBusinessObject = _testClient.Query(string.Empty, "intra.adw.industrialization_data", $"number={productCode}",string.Empty, new string[] { "*" });
            if(genericBusinessObject == null || genericBusinessObject.Length==0 || !genericBusinessObject[0].properties.Any())
                return testCard;

            foreach(var kvp in genericBusinessObject[0].properties)
            {
                //kvp.
            }

            return testCard;
        }
    }
}
