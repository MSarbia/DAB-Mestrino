using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InforConnectorLibrary
{
    public class InforResult
    {
        public bool InforCallSucceeded { get; set; }

        public string Error { get; set; }

        public InforResult()
        { }

        public InforResult(bool inforCallSucceeded, string error)
        {
            InforCallSucceeded = inforCallSucceeded;

            if (string.IsNullOrEmpty(error) == true)
            {
                Error = "";
            }
            else
            {
                Error = error;
            }
        }
    }
}
