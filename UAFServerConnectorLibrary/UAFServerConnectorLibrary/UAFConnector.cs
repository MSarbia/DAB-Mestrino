using System;
using System.Linq;
using Siemens.SimaticIT.Unified.Lean;
using Siemens.SimaticIT.Runtime.Common;
using System.Security.Permissions;
using System.Runtime.ConstrainedExecution;
using System.Runtime.InteropServices;
using System.Security;
using System.Security.Principal;
using Microsoft.Win32.SafeHandles;
using Siemens.SimaticIT.SDK.Diagnostics.Tracing;
using Siemens.SimaticIT.Unified.Common;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using Siemens.SimaticIT.DataModel;

namespace UAFServerConnectorLibrary
{
    public class UAFConnector : IUAFConnector
    {
        private readonly IUnifiedSdkLean _leanPlatform;

        public UAFConnector()
        {
            LeanFactory.Initialize("USER_APPLICATION");
            //_serviceEvent = new ServiceEventGateway();
            _leanPlatform = LeanFactory.Create();
            var principal = ClaimsPrincipal.Current;
            _leanPlatform.SetWindowsAuthentication();
            //Impersonate("Administrator", "SwqaMe$1");
        }

        #region ITestSdk implementation
        public ITracer Tracer => _leanPlatform.Tracer;

        public ClaimsPrincipal Principal => _leanPlatform.Principal;

        public Task<TResponse> SendCommand<TCommand, TResponse>(TCommand command, SendOptions options = null)
            where TCommand : ICommand
            where TResponse : Response<TCommand>
        {
            return _leanPlatform.SendCommand<TCommand, TResponse>(command, options);
        }

        public TResponse CallCommand<TCommand, TResponse>(TCommand command, SendOptions options = null)
            where TCommand : ICommand
            where TResponse : Response<TCommand>
        {
            return _leanPlatform.CallCommand<TCommand, TResponse>(command, options);
        }

        public Guid SubscribeEvent(Type eventType, string eventName, EventEnvelope subscriptionFilters, Action<IEvent, EventEnvelope, Guid, object> callback, object userData = null, string queueName = null)
        {
            return _leanPlatform.SubscribeEvent(eventType, eventName, subscriptionFilters, callback, userData, queueName);
        }

        public Guid SubscribeEvent<T>(string eventName, EventEnvelope subscriptionFilters, Action<T, EventEnvelope, Guid, object> callback, object userData = null, string queueName = null) where T : IEvent
        {
            return _leanPlatform.SubscribeEvent<T>(eventName, subscriptionFilters, callback, userData, queueName);
        }

        public bool Unsubscribe(Guid token)
        {
            return _leanPlatform.Unsubscribe(token);
        }

        public Task<bool> FireEvent(IEvent evt, EventEnvelope envelope = null)
        {
            return _leanPlatform.FireEvent(evt, envelope);
        }

        public IQueryable ProjectionQuery(Type entityType)
        {
            return _leanPlatform.ProjectionQuery(entityType);
        }

        public IQueryable<TEntity> ProjectionQuery<TEntity>() where TEntity : IPrimitiveEntity
        {
            return (IQueryable<TEntity>)ProjectionQuery(typeof(TEntity));
        }

        public Content GetContent(Guid id, UnifiedContentNamespace contentNamespace = UnifiedContentNamespace.Application)
        {
            return _leanPlatform.GetContent(id, contentNamespace);
        }

        public Content GetContentByName(string name, Guid? folderId, UnifiedContentNamespace contentNamespace = UnifiedContentNamespace.Application)
        {
            return _leanPlatform.GetContentByName(name, folderId, contentNamespace);
        }

        public Stream GetContentPayload(Guid id, UnifiedContentNamespace contentNamespace = UnifiedContentNamespace.Application)
        {
            return _leanPlatform.GetContentPayload(id, contentNamespace);
        }

        public IEnumerable<Content> GetContentList(Guid? folderId, UnifiedContentNamespace contentNamespace = UnifiedContentNamespace.Application)
        {
            return _leanPlatform.GetContentList(folderId, contentNamespace);
        }

        public Folder GetFolder(Guid id, UnifiedContentNamespace contentNamespace = UnifiedContentNamespace.Application)
        {
            return _leanPlatform.GetFolder(id, contentNamespace);
        }

        public Folder GetFolderByName(string name, Guid? parentId, UnifiedContentNamespace contentNamespace = UnifiedContentNamespace.Application)
        {
            return _leanPlatform.GetFolderByName(name, parentId, contentNamespace);
        }

        public IEnumerable<Folder> GetFolderList(Guid? parentId, UnifiedContentNamespace contentNamespace = UnifiedContentNamespace.Application)
        {
            return _leanPlatform.GetFolderList(parentId, contentNamespace);
        }

        public IEvent GetCommittedEvent(Guid sessionId, EntityDomain entityDomain)
        {
            return _leanPlatform.GetCommittedEvent(sessionId, entityDomain);
        }

        public IEnumerable<IEvent> GetCommittedEvents(Guid lastSessionId, EntityDomain entityDomain)
        {
            return _leanPlatform.GetCommittedEvents(lastSessionId, entityDomain);
        }

        public IEnumerable<IEvent> GetCommittedEventsInRange(Guid sessionIdFrom, Guid sessionIdTo, EntityDomain entityDomain)
        {
            return _leanPlatform.GetCommittedEventsInRange(sessionIdFrom, sessionIdTo, entityDomain);
        }
        #endregion

        #region Private Methods
        internal static class Advapi32
        {
            [DllImport("advapi32.dll", SetLastError = true)]
            public static extern bool DuplicateToken(IntPtr ExistingTokenHandle, int SECURITY_IMPERSONATION_LEVEL,
                                                     out IntPtr DuplicateTokenHandle);

            [DllImport("advapi32.dll", SetLastError = true)]
            public static extern bool LogonUser(string lpszUsername, string lpszDomain, string lpszPassword,
                                                int dwLogonType, int dwLogonProvider, out IntPtr phToken);
        }

        internal static class Kernel32
        {
            [DllImport("kernel32.dll", SetLastError = true)]
            [return: MarshalAs(UnmanagedType.Bool)]
            public static extern bool CloseHandle(IntPtr hObject);
        }


        [PermissionSet(SecurityAction.Demand, Name = "FullTrust")]
        public void Impersonate(string userName, string password)
        {
            Impersonate(Environment.MachineName, userName, password);
        }
        // Test harness.
        // If you incorporate this code into a DLL, be sure to demand FullTrust.
        [PermissionSet(SecurityAction.Demand, Name = "FullTrust")]
        public void Impersonate(string domain, string userName, string password)
        {
            const int logon32ProviderDefault = 0;
            //This parameter causes LogonUser to create a primary token.
            const int logon32LogonInteractive = 2;

            // Call LogonUser to obtain a handle to an access token.
            SafeTokenHandle safeTokenHandle;
            bool returnValue = LogonUser(userName, domain, password,
                logon32LogonInteractive, logon32ProviderDefault,
                out safeTokenHandle);

            if (!returnValue)
            {
                int ret = Marshal.GetLastWin32Error();
                throw new System.ComponentModel.Win32Exception(ret);
            }
            using (safeTokenHandle)
            {
                // Use the token handle returned by LogonUser.
                using (WindowsIdentity newId = new WindowsIdentity(safeTokenHandle.DangerousGetHandle()))
                {
                    using (WindowsImpersonationContext impersonatedUser = newId.Impersonate())
                    {
                        _leanPlatform.SetWindowsAuthentication();
                    }
                }
            }
        }

        private sealed class SafeTokenHandle : SafeHandleZeroOrMinusOneIsInvalid
        {
            private SafeTokenHandle()
                : base(true)
            {
            }

            [DllImport("kernel32.dll")]
            [ReliabilityContract(Consistency.WillNotCorruptState, Cer.Success)]
            [SuppressUnmanagedCodeSecurity]
            [return: MarshalAs(UnmanagedType.Bool)]
            private static extern bool CloseHandle(IntPtr handle);

            protected override bool ReleaseHandle()
            {
                return CloseHandle(handle);
            }
        }

        [DllImport("advapi32.dll", SetLastError = true)]
        private static extern bool LogonUser(
                string lpszUsername,
                string lpszDomain,
                string lpszPassword,
                int dwLogonType,
                int dwLogonProvider,
                out IntPtr phToken);

        [DllImport("advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        private static extern bool LogonUser(String lpszUsername, String lpszDomain, String lpszPassword,
            int dwLogonType, int dwLogonProvider, out SafeTokenHandle phToken);

        [DllImport("kernel32.dll", CharSet = CharSet.Auto)]
        private extern static bool CloseHandle(IntPtr handle);

        #endregion
    }
}
