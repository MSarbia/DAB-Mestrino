using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAFClientConnectorLibrary
{
    static class JSONSerializer
    {
        public static string Serialize<TClass>(TClass value)
        {
            return JsonConvert.SerializeObject(value);
        }
        public static TClass Deserialize<TClass>(string value)
        {
            return JsonConvert.DeserializeObject<TClass>(value);
        }

    }
}
