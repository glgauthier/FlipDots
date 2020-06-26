using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;

namespace FlipDots
{
    [OpenApiTag("Dots",Description ="API for controlling flip dot display")]
    [Route("/[controller]/[action]")]
    [ApiController]
    public class DotsController : ControllerBase
    {
        public DotsController()
        {

        }

        /// <summary>
        /// Get the status of an individual dot (on/off)
        /// </summary>
        /// <param name="id">dot id. returns entire display if -1</param>
        [HttpGet("{id}")]
        public ActionResult Status(int id = -1)
        {
            return Ok(id.ToString());
        }

        /// <summary>
        /// Get connection status of the display
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Connection()
        {
            Dictionary<string, string> resultString = new Dictionary<string, string>() { };
            resultString.Add("ConnectionState", "who even knows"); // note that this will be converted to camelcase automatically
            return Ok(resultString);
        }
    }
}
