﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;


namespace WindchillDocConnectorLibrary
{

    static class XMLConfigParse
    {

        static public List<String> getSoftTypes()
        {
            List<String> softtypes = new List<String>();

            XDocument xdoc = XDocument.Load("WindchillDocService_Config.xml");

            var lv1s = from lv1 in xdoc.Descendants("SoftType")
                       select new
                       {
                           type = lv1.Attribute("value").Value,
                       };

            foreach (var lv1 in lv1s)
                softtypes.Add(lv1.type);

            return softtypes;

        }

        static public Dictionary<string, string> getContentRoleTypes(string SoftTypes)
        {
            Dictionary<string, string> contentRoleTypes = new Dictionary<string, string>();

            XDocument xdoc = XDocument.Load("WindchillDocService_Config.xml");


            var lv1s = from lv1 in xdoc.Descendants("SoftType").Where(x => x.Attribute("value").Value == SoftTypes)
                       select new
                       {
                           CRT = lv1.Descendants("ContentRoleType")
                       };

            foreach (var lv1 in lv1s)
            {
                foreach (var lv in lv1.CRT)
                {
                    string docType = lv.Attribute("docType").Value;
                    contentRoleTypes.Add(lv.Value, docType);
                }
            }
            return contentRoleTypes;
        }
    }
}