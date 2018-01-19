using OTWeb.DataContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Net;
using System.Runtime.Serialization.Json;
namespace TestConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            Login();
            GetSerials();
        }

        private static void Login()
        {
            LoginRequest login = new LoginRequest
            {
                User = "OP1",
                Password = "OP1"
            };

            DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(LoginRequest));
            MemoryStream mem = new MemoryStream();
            ser.WriteObject(mem, login);
            string data = Encoding.UTF8.GetString(mem.ToArray(), 0, (int)mem.Length);
            WebClient webClient = new WebClient();
            webClient.Headers["Content-type"] = "application/json";
            webClient.Encoding = Encoding.UTF8;
            var response = webClient.UploadString("http://localhost:50732/OTService.svc/Login", "POST", data);
            Console.WriteLine(response);
            Console.ReadLine();
        }

        private static void GetSerials()
        {
            GetSerialsRequest login = new GetSerialsRequest
            {
                User = "OP1",
                Password = "OP1",
                Equipment = "Equip1"
            };

            DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(GetSerialsRequest));
            MemoryStream mem = new MemoryStream();
            ser.WriteObject(mem, login);
            string data = Encoding.UTF8.GetString(mem.ToArray(), 0, (int)mem.Length);
            WebClient webClient = new WebClient();
            webClient.Headers["Content-type"] = "application/json";
            webClient.Encoding = Encoding.UTF8;
            var response = webClient.UploadString("http://localhost.fiddler:50732/OTService.svc/GetSerials", "POST", data);
            Console.WriteLine(response);
            Console.ReadLine();
        }
    }
}
