using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAFClientConnectorLibrary.DataTypes
{
    public abstract class BaseResponse
    {
        //
        // Summary:
        //     Initializes an instance of the Siemens.SimaticIT.Unified.Common.Response class
        //     with default values.
        public BaseResponse() {
            Error = new ExecutionError();
        }

        //
        // Summary:
        //     Gets and sets the execution error.
        //
        // Remarks:
        //     Null is not an acceptable value, and will be discarded.
        public ExecutionError Error { get; set; }
        //
        // Summary:
        //     Gets if the required command is completed with success.
        public bool Succeeded { get; set; }

    }
}
