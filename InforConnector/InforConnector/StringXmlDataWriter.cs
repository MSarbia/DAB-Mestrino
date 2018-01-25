using System.ServiceModel.Channels;
using System.Xml;

namespace InforConnector
{
    public class StringXmlDataWriter : BodyWriter
    {
        private string data;

        public StringXmlDataWriter(string data)
            : base(false)
        {
            this.data = data;
        }

        protected override void OnWriteBodyContents(XmlDictionaryWriter writer)
        {
            writer.WriteRaw(data);
        }
    }
}
