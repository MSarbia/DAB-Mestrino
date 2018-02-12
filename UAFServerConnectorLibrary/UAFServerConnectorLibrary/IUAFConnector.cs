using Siemens.SimaticIT.DataModel;
using Siemens.SimaticIT.Unified.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAFServerConnectorLibrary
{
    interface IUAFConnector
    {
        //ITracer Tracer { get; }

        //ClaimsPrincipal Principal { get; }

        void Impersonate(string userName, string password);

        Task<TResponse> SendCommand<TCommand, TResponse>(TCommand command, SendOptions options = null)
            where TCommand : ICommand
            where TResponse : Response<TCommand>;

        TResponse CallCommand<TCommand, TResponse>(TCommand command, SendOptions options = null)
            where TCommand : ICommand
            where TResponse : Response<TCommand>;

        //IQueryable ProjectionQuery(Type entityType);
        IQueryable<TEntity> ProjectionQuery<TEntity>() where TEntity : IPrimitiveEntity;

        //Guid SubscribeEvent(Type eventType, string eventName, EventEnvelope subscriptionFilters, Action<IEvent, EventEnvelope, Guid, object> callback, object userData = null, string queueName = null);

        //Guid SubscribeEvent<T>(string eventName, EventEnvelope subscriptionFilters, Action<T, EventEnvelope, Guid, object> callback, object userData = null, string queueName = null) where T : IEvent;

        //bool Unsubscribe(Guid token);

        Task<bool> FireEvent(IEvent evt, EventEnvelope envelope = null);

        //Content GetContent(Guid id, UnifiedContentNamespace contentNamespace = UnifiedContentNamespace.Application);

        //Content GetContentByName(string name, Guid? folderId, UnifiedContentNamespace contentNamespace = UnifiedContentNamespace.Application);

        //Stream GetContentPayload(Guid id, UnifiedContentNamespace contentNamespace = UnifiedContentNamespace.Application);

        //IEnumerable<Content> GetContentList(Guid? folderId, UnifiedContentNamespace contentNamespace = UnifiedContentNamespace.Application);

        //Folder GetFolder(Guid id, UnifiedContentNamespace contentNamespace = UnifiedContentNamespace.Application);

        //Folder GetFolderByName(string name, Guid? parentId, UnifiedContentNamespace contentNamespace = UnifiedContentNamespace.Application);

        //IEnumerable<Folder> GetFolderList(Guid? parentId, UnifiedContentNamespace contentNamespace = UnifiedContentNamespace.Application);

        //IEvent GetCommittedEvent(Guid sessionId, EntityDomain entityDomain);

        //IEnumerable<IEvent> GetCommittedEvents(Guid lastSessionId, EntityDomain entityDomain);

        //IEnumerable<IEvent> GetCommittedEventsInRange(Guid sessionIdFrom, Guid sessionIdTo, EntityDomain entityDomain);
    }
}
