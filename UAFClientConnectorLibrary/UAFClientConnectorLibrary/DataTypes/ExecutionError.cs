using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAFClientConnectorLibrary.DataTypes
{
    public sealed class ExecutionError
    {

        public ExecutionError()
        {

        }

        //
        // Summary:
        //     Gets and sets the custom error code.
        public int ErrorCode { get; set; }
        //
        // Summary:
        //     Gets and sets the custom error message.
        public string ErrorMessage { get; set; }
    }
}
