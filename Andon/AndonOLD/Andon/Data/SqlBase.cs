using System;
using System.Collections.Generic;
using System.Text;
using System.Data.SqlClient;
using System.Data;
using System.Text.RegularExpressions;

namespace Library.Sql
{
    public class SqlBase
    {
        public static object Locker = new object();

        private static string myConnection = "";
        public static string DefaultConnection
        {
            get
            {
                if (myConnection == "")
                {
                    try
                    {
                        myConnection = System.Configuration.ConfigurationManager.ConnectionStrings["DEFAULT"].ToString();
                    }
                    catch
                    {
                        myConnection = "?";
                    }
                }
                return (myConnection);
            }

            set
            {
                myConnection = value;
            }
        }

        private static int myCommandTimeout = 0;
        public static int CommandTimeout
        {
            get
            {
                if (myCommandTimeout == 0)
                {
                    try
                    {
                        string s = System.Configuration.ConfigurationManager.AppSettings["SQL_COMMAND_TIMEOUT"].ToString();

                        int.TryParse(s, out myCommandTimeout);
                        if (myCommandTimeout <= 0)
                            myCommandTimeout = 30;
                    }
                    catch
                    {
                        myCommandTimeout = 30;
                    }
                }
                return (myCommandTimeout);
            }

            set
            {
                myCommandTimeout = value;
            }
        }

        public static string GetTimeSpan(DateTime startat)
        {
            TimeSpan ts = new TimeSpan();
            try
            {
                ts = DateTime.UtcNow - startat;
                return (ts.ToString());
            }
            catch
            {
                return ("");
            }
        }

        public static void MyTraceError(DateTime startat, string sql, Exception ex)
        {
            try
            {
                //switch (Library.WebUtility.ConfigurationAppSetting("TRACE_SQL_ERROR", "").ToUpper())
                //{
                //    case "FULL":
                //        Library.Tracer.WebTextWriter.WriteLine(
                //            "MyTraceError"
                //            + System.Environment.NewLine + "Duration:" + GetTimeSpan(startat)
                //            + System.Environment.NewLine + "SQL:" + sql
                //            + System.Environment.NewLine + "Exception:" + ex.ToString());
                //        break;

                //    case "SMALL":
                //        Library.Tracer.WebTextWriter.WriteLine(
                //            "MyTraceError"
                //            + System.Environment.NewLine + "Duration:" + GetTimeSpan(startat)
                //            + System.Environment.NewLine + "SQL:" + traceSql(sql)
                //            + System.Environment.NewLine + "Exception:" + ex.ToString());
                //        break;
                //}
            }
            catch { }
        }

        public static string GetDataSetTotal(DataSet ds)
        {
            if (ds == null)
                return ("NULL");

            StringBuilder sb = new StringBuilder();

            try
            {
                for (int i = 0; i < ds.Tables.Count; i++)
                {
                    DataTable dt = ds.Tables[i];

                    sb.Append(dt.TableName
                        + ":" + dt.Columns.Count.ToString()
                        + ":" + dt.Rows.Count.ToString() + " ");
                }
            }
            catch { }
            return (sb.ToString());
        }


        public static string GetDataSetToString(DataSet ds)
        {
            if (ds == null)
                return ("NULL");

            string result = "";

            try
            {
                GetTablename(ds);

                foreach (DataTable dt in ds.Tables)
                {

                    foreach (DataColumn dc in dt.Columns)
                    {
                        try
                        {
                            dc.ColumnMapping = MappingType.Attribute;
                        }
                        catch { }
                    }

                }

                System.IO.StringWriter sw = new System.IO.StringWriter();
                ds.WriteXml(sw);
                result = sw.ToString();

                sw.Dispose();
            }
            catch { }

            return (result);
        }

        public static string GetDataSetToString_OLD(DataSet ds)
        {
            if (ds == null)
                return ("NULL");

            StringBuilder sb = new StringBuilder();

            try
            {
                for (int i = 0; i < ds.Tables.Count; i++)
                {
                    DataTable dt = ds.Tables[i];

                    sb.AppendLine(dt.TableName);

                    for (int ii = 0; ii < dt.Columns.Count; ii++)
                    {
                        try
                        {
                            sb.Append('"' + dt.Columns[ii].ColumnName.Replace("\"", "\"\"") + '"' + "\t");
                        }
                        catch
                        {
                            sb.Append("\t");
                        }
                    }
                    sb.AppendLine("");

                    for (int r = 0; r < dt.Rows.Count; r++)
                    {
                        for (int ii = 0; ii < dt.Columns.Count; ii++)
                        {
                            try
                            {
                                sb.Append('"' + dt.Rows[r][ii].ToString().Replace("\"", "\"\"") + '"' + "\t");
                            }
                            catch
                            {
                                sb.Append("\t");
                            }
                        }
                        sb.AppendLine("");
                    }

                }
            }
            catch { }
            return (sb.ToString());
        }

        public static void MyTraceSqlDataSet(DateTime startat, string sql, DataSet dt)
        {
            try
            {
                //string profile = Library.WebUtility.ConfigurationAppSetting("TRACE_SQL_PROFILE", "");

                //if (profile != "")
                //{
                //    try
                //    {
                //        Regex reg = new Regex(profile, RegexOptions.IgnoreCase);
                //        MatchCollection matches = reg.Matches(sql.Trim());
                //        if (matches.Count > 0)
                //        {
                //            string s = "";
                //            for (int i = 0; i < matches.Count; i++)
                //                s += matches[i] + ";";

                //            if (s.Length > 255)
                //                s = s.Substring(0, 255);

                //            ExecuteNonQuery(string.Format(
                //                "INSERT INTO SqlProfileLog (ID, Timestamp, Command, Result ) VALUES ('{0}', '{1}', '{2}', '{3}' ) "
                //                , s.Replace("'", "''")
                //                , ConvertDateTime(DateTime.Now)
                //                , sql.Replace("'", "''")
                //                , GetDataSetToString(dt).Replace("'", "''")
                //                ));

                //        }
                //    }
                //    catch { }
                //}


                //if (sql.IndexOf("INSERT INTO SqlProfileLog") >= 0)
                //    return;

                //switch (Library.WebUtility.ConfigurationAppSetting("TRACE_SQL", "").ToUpper())
                //{
                //    case "FULL":
                //        Library.Tracer.WebTextWriter.WriteLine(
                //            "MyTraceSqlDataSet"
                //            + System.Environment.NewLine + "DURATION:" + GetTimeSpan(startat)
                //            + System.Environment.NewLine + "SQL:" + sql.Trim()
                //            + System.Environment.NewLine + "RETURN:" + GetDataSetTotal(dt));
                //        break;

                //    case "FULLDATA":
                //        Library.Tracer.WebTextWriter.WriteLine(
                //            "MyTraceSqlDataSet"
                //            + System.Environment.NewLine + "DURATION:" + GetTimeSpan(startat)
                //            + System.Environment.NewLine + "SQL:" + sql.Trim()
                //            + System.Environment.NewLine + "RETURN:" + GetDataSetToString(dt));
                //        break;

                //    case "SMALL":
                //        Library.Tracer.WebTextWriter.WriteLine(
                //            "MyTraceSqlDataSet"
                //            + System.Environment.NewLine + "DURATION:" + GetTimeSpan(startat)
                //            + System.Environment.NewLine + "SQL:" + traceSql(sql));
                //        break;
                //}
            }
            catch { }

        }

        public static void MyTraceSqlNonQuery(DateTime startat, string sql, int num)
        {
            try
            {
                //switch (Library.WebUtility.ConfigurationAppSetting("TRACE_SQL", "").ToUpper())
                //{
                //    case "FULL":
                //    case "FULLDATA":
                //        Library.Tracer.WebTextWriter.WriteLine(
                //           "MyTraceSqlNonQuery"
                //            + System.Environment.NewLine + "DURATION:" + GetTimeSpan(startat)
                //            + System.Environment.NewLine + "SQL:" + sql.Trim()
                //            + System.Environment.NewLine + "RETURN:" + num.ToString());
                //        break;

                //    case "SMALL":
                //        Library.Tracer.WebTextWriter.WriteLine(
                //            "MyTraceSqlNonQuery"
                //            + System.Environment.NewLine + "DURATION:" + GetTimeSpan(startat)
                //            + System.Environment.NewLine + "SQL:" + traceSql(sql)
                //            + System.Environment.NewLine + "RETURN:" + num.ToString());
                //        break;
                //}
            }
            catch { }
        }

        public static void MyTraceSqlScalar(DateTime startat, string sql, object o)
        {
            try
            {
                //switch (Library.WebUtility.ConfigurationAppSetting("TRACE_SQL", "").ToUpper())
                //{
                //    case "FULL":
                //    case "FULLDATA":
                //        Library.Tracer.WebTextWriter.WriteLine(
                //            "MyTraceSqlScalar"
                //            + System.Environment.NewLine + "DURATION:" + GetTimeSpan(startat)
                //            + System.Environment.NewLine + "SQL:" + sql.Trim()
                //            + System.Environment.NewLine + "RETURN:" + o.ToString());
                //        break;

                //    case "SMALL":
                //        Library.Tracer.WebTextWriter.WriteLine(
                //            "MyTraceSqlScalar"
                //            + System.Environment.NewLine + "DURATION:" + GetTimeSpan(startat)
                //            + System.Environment.NewLine + "SQL:" + traceSql(sql)
                //            + System.Environment.NewLine + "RETURN:" + o.ToString());
                //        break;
                //}
            }
            catch { }
        }

        public static string ConvertDateTime(string str)
        {
            DateTime dt;

            try
            {
                dt = Convert.ToDateTime(str);
            }
            catch
            {
                return (null);
            }

            return (dt.ToString("yyyy-MM-ddTHH") + ":" +
                            dt.ToString("mm") + ":" +
                            dt.ToString("ss") + "." +
                            dt.ToString("fff"));
        }

        public static string ConvertDate(DateTime dt)
        {
            try
            {

                return (dt.ToString("yyyy-MM-dd"));
            }
            catch
            {
                return ("");
            }
        }

        public static string ConvertDateTime(DateTime dt)
        {
            try
            {

                return (dt.ToString("yyyy-MM-ddTHH") + ":" +
                                   dt.ToString("mm") + ":" +
                                   dt.ToString("ss") + "." +
                                   dt.ToString("fff"));
            }
            catch
            {
                return ("");
            }
        }

        public static string SetDecimalPoint(string strValue)
        {
            try
            {
                return strValue.Replace(",", ".");
            }
            catch
            {
                return strValue;
            }

        }

        public static void GetTablename(DataSet ds)
        {
            try
            {
                if (ds == null)
                    return;

                for (int i = 0; i < ds.Tables.Count; i++)
                {
                    string prefix = "TABLENAME_";

                    if (ds.Tables[i].Columns.Count <= 0)
                        continue;

                    try
                    {
                        string s = ds.Tables[i].Columns[0].ColumnName.ToUpper().Trim();
                        if (s.IndexOf(prefix) == 0)
                        {
                            try
                            {
                                ds.Tables[i].TableName = s.Substring(prefix.Length);
                            }
                            catch { }

                            try
                            {
                                ds.Tables[i].Columns.RemoveAt(0);
                            }
                            catch { }
                        }
                    }
                    catch { }
                }
            }
            catch { }
        }


        public static DataSet GetDataSet(string sql)
        {
            return (GetDataSet(sql, DefaultConnection));
        }

        public static string traceSql(string sql)
        {
            if (sql.Length > 500)
                return (sql.Substring(0, 500).Trim() + "...");

            return (sql.Trim());
        }
        public static DataSet GetDataSet(string sql, string connectionString)
        {
            DataSet ret = new DataSet();
            DateTime dt = DateTime.UtcNow;

            try
            {
                SqlDataAdapter da = new SqlDataAdapter("", connectionString);

                da.SelectCommand.CommandText = sql.Trim();
                da.SelectCommand.CommandTimeout = CommandTimeout;

                da.Fill(ret);
                da.Dispose();

                MyTraceSqlDataSet(dt, sql, ret);

                return ret;
            }
            catch (Exception ex)
            {
                MyTraceError(dt, sql, ex);
                return (null);
            }
        }

        public static DataSet GetDataSet2(string sql, out string error, int timeout = 0)
        {
            if (timeout <= 0) timeout = CommandTimeout;

            error = "";
            DataSet ret = new DataSet();
            DateTime dt = DateTime.UtcNow;

            try
            {
                SqlDataAdapter da = new SqlDataAdapter("", DefaultConnection);

                da.SelectCommand.CommandText = sql.Trim();
                da.SelectCommand.CommandTimeout = timeout;

                da.Fill(ret);
                da.Dispose();

                MyTraceSqlDataSet(dt, sql, ret);

                return ret;
            }
            catch (Exception ex)
            {
                error = ex.ToString();
                MyTraceError(dt, sql, ex);
                return (null);
            }
        }

        public static int getInteger(object val)
        {
            return (int.Parse(val.ToString()));
        }

        public static int ExecuteWithReturnValue(string sql)
        {
            return (ExecuteWithReturnValue(sql, DefaultConnection));
        }

        public static int ExecuteWithReturnValue(string sql, string connectionString)
        {
            int retValue = -9999;

            DataTable dt = GetDataTable(sql, connectionString);
            if (dt == null)
                return (retValue);

            try
            {
                if (dt.Rows[0][0] != System.DBNull.Value)
                    retValue = int.Parse(dt.Rows[0][0].ToString());
            }
            catch { }

            return (retValue);
        }



        public static DataTable GetDataTableWithError(string sql, out string error)
        {
            error = "";

            DataSet ret = new DataSet();
            DateTime dt = DateTime.UtcNow;

            try
            {
                SqlDataAdapter da = new SqlDataAdapter("", DefaultConnection);

                da.SelectCommand.CommandText = sql.Trim();
                da.SelectCommand.CommandTimeout = CommandTimeout;

                da.Fill(ret);
                da.Dispose();

                MyTraceSqlDataSet(dt, sql, ret);

                return ret.Tables[0];
            }
            catch (Exception ex)
            {
                error = ex.Message;
                MyTraceError(dt, sql, ex);
                return (null);
            }
        }


        public static DataTable GetDataTable(string sql)
        {
            return (GetDataTable(sql, DefaultConnection));
        }

        public static DataTable GetDataTable(string sql, string connectionString)
        {
            DataSet ds = GetDataSet(sql, connectionString);

            if (ds != null && ds.Tables.Count > 0)
                return (ds.Tables[0]);
            else
                return (null);
        }


        public static int ExecuteNonQuery(List<string> sql, out string error)
        {
            return (ExecuteNonQuery(sql, DefaultConnection, out error));
        }

        public static int ExecuteNonQuery(List<string> sql, string connectionString, out string error)
        {
            error = "";


            {
                SqlConnection iConn = new SqlConnection();
                SqlCommand iCmd = null;
                DateTime dtFull = DateTime.UtcNow;

                error = "";

                try
                {
                    iConn.ConnectionString = connectionString;
                    iConn.Open();

                    SqlTransaction t = iConn.BeginTransaction();

                    int row = 0;
                    for (int ii = 0; ii < sql.Count; ii++)
                    {
                        DateTime dt = DateTime.UtcNow;

                        try
                        {
                            iCmd = new SqlCommand(sql[ii], iConn);
                            iCmd.Transaction = t;
                            iCmd.CommandTimeout = CommandTimeout;
                            int i = iCmd.ExecuteNonQuery();
                            row++;

                            MyTraceSqlNonQuery(dt, sql[ii], i);

                        }
                        catch (Exception exception)
                        {
                            error += exception.Message;
                            MyTraceError(dt, sql[ii], exception);
                            t.Rollback();

                            break;
                        }
                    }

                    if (row >= sql.Count)
                        t.Commit();

                    iConn.Close();
                    iConn.Dispose();
                    return (row);
                }
                catch (Exception ex)
                {
                    error = ex.Message.ToString();
                    MyTraceError(dtFull, "", ex);

                    try
                    {
                        iConn.Close();
                    }
                    catch { };
                    try
                    {
                        iConn.Dispose();
                    }
                    catch { };

                    return (-1);
                }
            }
        }

        public static int ExecuteNonQuery(string sql)
        {
            return (ExecuteNonQuery(sql, DefaultConnection));
        }

        public static int ExecuteNonQuery(string sql, string connectionString)
        {
            string err = "";
            return (ExecuteNonQuery(sql, connectionString, ref err));
        }

        public static int ExecuteNonQuery(string sql, ref string error)
        {
            return (ExecuteNonQuery(sql, DefaultConnection, ref error));
        }

        public static int ExecuteNonQuery(string sql, string connectionString, ref string error)
        {

            {
                SqlConnection iConn = new SqlConnection();
                SqlCommand iCmd = null;
                DateTime dt = DateTime.UtcNow;

                error = "";

                try
                {
                    iConn.ConnectionString = connectionString;
                    iConn.Open();

                    iCmd = new SqlCommand(sql, iConn);
                    iCmd.CommandTimeout = CommandTimeout;
                    int i = iCmd.ExecuteNonQuery();

                    iConn.Close();
                    iConn.Dispose();

                    MyTraceSqlNonQuery(dt, sql, i);
                    return (i);
                }
                catch (Exception ex)
                {
                    MyTraceError(dt, sql, ex);
                    error = ex.Message.ToString();

                    try
                    {
                        iConn.Close();
                    }
                    catch { };
                    try
                    {
                        iConn.Dispose();
                    }
                    catch { };

                    return (-1);
                }
            }
        }

        public static int ExecuteScalarInt(string str)
        {
            return (ExecuteScalarInt(str, DefaultConnection));
        }

        public static int ExecuteScalarInt(string str, string connectionString)
        {
            string msg = "";
            int iret = -9999;
            object o = ExecuteScalar(str, ref msg, connectionString);
            if (o != null)
                iret = int.Parse(o.ToString());
            return (iret);
        }


        public static object ExecuteScalar(string str)
        {
            return (ExecuteScalar(str, DefaultConnection));
        }

        public static object ExecuteScalar(string str, string connectionString)
        {
            string msg = "";
            return (ExecuteScalar(str, ref msg, connectionString));
        }

        public static object ExecuteScalar(string str, ref string msg)
        {
            return (ExecuteScalar(str, ref msg, DefaultConnection));
        }


        public static object ExecuteScalar(string str, ref string msg, string connectionString)
        {
            SqlConnection iConn = null;
            DateTime dt = DateTime.UtcNow;
            msg = "";
            try
            {
                iConn = new SqlConnection(connectionString);
                iConn.Open();

                if (iConn == null)
                    return (null);

                SqlCommand iCmd = new SqlCommand(str, iConn);
                if (iCmd == null)
                    return (null);

                iCmd.CommandTimeout = CommandTimeout;
                object o = iCmd.ExecuteScalar();

                iConn.Close();
                iConn.Dispose();

                MyTraceSqlScalar(dt, str, o);

                return (o);
            }
            catch (Exception ex)
            {
                msg = ex.Message;
                MyTraceError(dt, str, ex);

                if (iConn != null)
                {
                    try
                    {
                        iConn.Close();
                        iConn.Dispose();
                    }
                    catch { }
                }
                return (null);
            }
        }
        public static string GetColumnValueString(DataRow dr, string columnName, string defaultValue)
        {
            string val = defaultValue;

            try
            {
                if (dr[columnName] == System.DBNull.Value)
                    return (defaultValue);

                val = dr[columnName].ToString().Trim();
            }
            catch { }

            return (val);
        }

        public static int GetColumnValueInt(DataRow dr, string columnName, int defaultValue)
        {
            string val = GetColumnValueString(dr, columnName, null);
            if (val == null)
                return (defaultValue);

            int ival = defaultValue;
            int.TryParse(val, out ival);
            return (ival);
        }


        public static float GetColumnValueFloat(DataRow dr, string columnName, float defaultValue)
        {
            string val = GetColumnValueString(dr, columnName, null);
            if (val == null)
                return (defaultValue);

            float fval = defaultValue;
            float.TryParse(val, out fval);
            return (fval);
        }


        public static string[,] GetTable(string sql)
        {
            return (GetTable(sql, DefaultConnection));

        }

        public static string[,] GetTable(string sql, string connectionString)
        {
            DataTable dt = GetDataTable(sql, connectionString);
            if (dt == null)
                return (null);

            string[,] s = new string[dt.Rows.Count, dt.Columns.Count];


            for (int r = 0; r < dt.Rows.Count; r++)
            {
                for (int c = 0; c < dt.Columns.Count; c++)
                {
                    s[r, c] = dt.Rows[r][c].ToString();
                }
            }

            return (s);
        }

        public static int GetDataSetResult(DataSet ds, out string error)
        {
            int retValue = -1;
            error = "NO DATA";

            if (ds == null)
                return (retValue);

            Library.Sql.SqlBase.GetTablename(ds);

            try
            {
                DataTable dtReturn = ds.Tables["return"];
                if (dtReturn == null)
                    return (retValue);

                if (dtReturn.Rows.Count <= 0)
                    return (retValue);

                retValue = Library.Sql.SqlBase.GetColumnValueInt(dtReturn.Rows[0], "ErrorCode", -1);
                error = Library.Sql.SqlBase.GetColumnValueString(dtReturn.Rows[0], "ErrorMessage", error);
            }
            catch (Exception ex)
            {
                error = ex.ToString();
            }
            return (retValue);
        }
    }
}

