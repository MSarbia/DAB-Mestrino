namespace SmartWatchConnectorLibrary
{
    public class MessageInfo
    {
        public OTMessageType Type { get; set; }
        public bool Delivered { get; set; }
    }

    public class MessageInfo<TData> :MessageInfo
    {
        public TData Data { get; set; }
    }
}