using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(OTWeb.CallHubStartup))]
namespace OTWeb
{
    public class CallHubStartup
    {
        public void Configuration(IAppBuilder app)
        {
            try
            {
                app.MapSignalR();
            }
            // Any connection or hub wire up and configuration should go here
            catch (Exception e)
            { }
        }
    }
}