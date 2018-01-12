using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.Drawing.Imaging;

namespace WindchillTestConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            while (true)
            {
                using (var client = new WindchillDocumentService.ExtClient("ExtPort"))
                {
                    var files = client.getRelatedDocuments("prova", "a", "");
                    foreach(var file in files)
                    {
                        var fileData = client.download(file.name, file.number, file.revision, "");
                        using (MemoryStream ms = new MemoryStream(Convert.FromBase64String(fileData.content)))
                        {
                            var image = Image.FromStream(ms);
                            image.Save($"C:\\temp\\{fileData.fileName}", ImageFormat.Jpeg);
                        }
                    }
                }
                Console.ReadLine();
            }
        }
    }
}
