using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
namespace FlipDots
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddResponseCompression();
            
            services.AddMvc(options => { options.EnableEndpointRouting = false; }).AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                options.SerializerSettings.Converters.Clear();
                options.UseCamelCasing(true); // everything returned from the api will be camelCase format. 
            });
            services.AddRouting(options => options.LowercaseUrls = true);
            services.AddSwaggerDocument(cfg => {
                cfg.PostProcess = document =>
                {
                    document.Info.Version = "v1";
                    document.Info.Title = "Flip Dot Display Controller";
                    document.Info.Description = "API layer for driving flip dot display and getting display info";
                };
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseResponseCompression();
            app.UseRouting();
            

            app.Use(async (context, next) =>
            {
                if(context.Request.Path.Value == "/")
                {
                    context.Response.Redirect("/index.html");
                    return;
                }
                // Do work that doesn't write to the Response.
                await next.Invoke();
                // Do logging or other work that doesn't write to the Response.
            });

            app.UseStaticFiles();
            app.UseOpenApi();
            app.UseSwaggerUi3();

            app.UseMvc(routes=>
            {
                routes.MapRoute(
                    name:"default",
                    template: "{controller=Home}/{action=Index}"
                    );
            });

        }
    }
}
