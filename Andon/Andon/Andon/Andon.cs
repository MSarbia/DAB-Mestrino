using System;
using System.Configuration;
using System.Xml;
using Engineering.DAB.Andon.Types;

namespace Engineering.DAB.Andon
{
    public class Andon
    {
        public int SetData (string sourceName, AndonData data)
        {
            int result = 0;
            string err = "";
            string messageData = createXml(data);

            //create xml struct for insert command
            //XmlSerializer serializer = new XmlSerializer(typeof(Community));
            //serializer.Serialize(File.Create("file.xml"), community);

            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["AndonDBConnectionString"].ConnectionString;
                string sqlQuery =
                    "INSERT INTO [dbo].[MessageIn]" +
                    "([SourceName],[MessageData])" +
                    "VALUES ('" + sourceName +
                    "', '" + messageData +
                    "')";

                result = Library.Sql.SqlBase.ExecuteNonQuery(sqlQuery, connectionString, ref err);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            
            return result;
        }

        string createXml(AndonData data)
        {
            try
            {
                XmlDocument xml = new XmlDocument();
                XmlElement root = xml.CreateElement("root");
                xml.AppendChild(root);
                foreach (var item in data.ListProductionInfo)
                {
                    XmlElement child = xml.CreateElement("production_info");
                    child.SetAttribute("name", item.var_name);
                    child.SetAttribute("line_description", item.line_description);
                    child.SetAttribute("shift_total_production", item.shift_total_production.ToString());
                    child.SetAttribute("shift_actual_production", item.shift_actual_production.ToString());
                    child.SetAttribute("shift_delay_production", item.shift_delay_production.ToString());
                    child.SetAttribute("team", item.team.ToString());
                    child.SetAttribute("order_product", item.order_product);
                    child.SetAttribute("order_product_description", item.order_product_description);
                    child.SetAttribute("order_total", item.order_total.ToString());
                    if (item.order_actual >= 0)
                        child.SetAttribute("order_actual", item.order_actual.ToString());
                    child.SetAttribute("order_customer", item.order_customer);
                    root.AppendChild(child);
                }
                foreach (var item in data.ListKPI)
                {
                    XmlElement child = xml.CreateElement("kpi");
                    child.SetAttribute("name", item.var_name);
                    child.SetAttribute("description", item.description);
                    child.SetAttribute("defect_per_shift", item.defect_per_shift.ToString());
                    child.SetAttribute("defect_min_shift", item.defect_min_shift.ToString());
                    child.SetAttribute("defect_max_shift", item.defect_max_shift.ToString());
                    child.SetAttribute("rework_per_shift", item.rework_per_shift.ToString());
                    child.SetAttribute("rework_min_shift", item.rework_min_shift.ToString());
                    child.SetAttribute("rework_max_shift", item.rework_max_shift.ToString());
                    child.SetAttribute("OEE_per_shift", item.OEE_per_shift.ToString());
                    child.SetAttribute("OEE_min_shift", item.OEE_min_shift.ToString());
                    child.SetAttribute("OEE_max_shift", item.OEE_max_shift.ToString());
                    child.SetAttribute("LE_per_shift", item.LE_per_shift.ToString());
                    child.SetAttribute("LE_min_shift", item.LE_min_shift.ToString());
                    child.SetAttribute("LE_max_shift", item.LE_max_shift.ToString());
                    root.AppendChild(child);
                }

                foreach (var item in data.ListVisualAlerts)
                {
                    XmlElement child = xml.CreateElement("visual_alerts");
                    child.SetAttribute("name", item.var_name);

                    XmlElement alert = xml.CreateElement("alert_v");
                    alert.SetAttribute("action", "deleteall");
                    child.AppendChild(alert);

                    foreach (var alertitem in item.alerts)
                    {
                        XmlElement ia = xml.CreateElement("alert_v");
                        ia.SetAttribute("order", alertitem.order.ToString());
                        ia.SetAttribute("line", alertitem.line);
                        ia.SetAttribute("unit", alertitem.unit);
                        ia.SetAttribute("timestamp", alertitem.timestamp);
                        ia.SetAttribute("type", ((int)alertitem.type).ToString());
                        ia.SetAttribute("status", ((int)alertitem.status).ToString());

                        child.AppendChild(ia);
                    }

                    root.AppendChild(child);
                }
                string s = xml.OuterXml;

                return s;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
