using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Description;
using System.ServiceModel.Dispatcher;
using System.Web;
using System.Xml;

namespace WindchillServiceDocMock
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    class RouteByBodyElementBehavior : Attribute, IServiceBehavior, IDispatchOperationSelector

    {

        #region IDispatchOperationSelector Members

        /// <summary>

        /// Selects the operation according to first element in the body element

        /// </summary>

        /// <param name="message"></param>

        /// <returns></returns>

        public string SelectOperation(ref Message message)

        {

            XmlDocument document = new XmlDocument();

            document.Load(message.GetReaderAtBodyContents());



            //Get the body element operation

            string bodyElement = document.DocumentElement.LocalName;



            // Create new message

            XmlNodeReader reader = new XmlNodeReader(document.DocumentElement);

            Message newMsg = Message.CreateMessage(message.Version, null, reader);




            // Preserve the headers of the original message

            newMsg.Headers.CopyHeadersFrom(message);

            foreach (string propertyKey in message.Properties.Keys)

                newMsg.Properties.Add(propertyKey, message.Properties[propertyKey]);




            // Close the original message and return new message

            message.Close();

            message = newMsg;




            return bodyElement;

        }

        #endregion


        #region IServiceBehavior Members

        /// <summary>

        /// Sets this class as operation selector for all dispatch behaviors in the service

        /// </summary>

        //public void ApplyBehavior(ServiceDescription description, ServiceHostBase serviceHostBase, System.Collections.ObjectModel.Collection<DispatchBehavior> behaviors, System.Collections.ObjectModel.Collection<BindingParameterCollection> parameters)

        //{

        //    foreach (DispatchBehavior dispatchBehavior in behaviors)

        //        dispatchBehavior.OperationSelector = this;

        //}

        public void Validate(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase)
        {
            throw new NotImplementedException();
        }

        public void AddBindingParameters(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase, Collection<ServiceEndpoint> endpoints, BindingParameterCollection bindingParameters)
        {
            throw new NotImplementedException();
        }

        public void ApplyDispatchBehavior(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase)
        {

        }

        #endregion

    }


}