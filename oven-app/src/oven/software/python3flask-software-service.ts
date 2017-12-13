import { SoftwareService } from "../software-service";
import { Project, Route } from "../models";


export class Python3FlaskSoftwareService implements SoftwareService {
    parseUrl(url_data: string, route: Route) {
        let httpMethod = url_data.split("/", 1)[0];
        route.httpMethod = httpMethod;
        let url = url_data.replace(httpMethod, "");
        route.url = url;
    }
    parseParams(url_data) : Array<string> {
        let parts = url_data.split("/");
        let params = new Array<string>();
        parts.forEach(part => {
            if(part.startsWith("<")) {
                if(part.indexOf(":") != -1) {
                    params.push(part.split(":")[1].replace(">", ""));
                } else {
                    params.push(part.replace("<", "").replace(">", ""));
                }
            }
        });
        return params;
    }
    parseProject(project: Project) {
        let lines = project.code_file.split("\n");
        let buffer = new Array<string>();
        let route: Route = null;
        project.routes = new Array<Route>();
        lines.forEach(line => {
            switch(line) {
                case "# oven:route:start":
                    route = new Route();
                    project._dirty = false;
                    break;
                case "# oven:route:end":
                    project.routes.push(route);
                    break;
                case "# oven:route:start_pre":
                    buffer = new Array<string>();
                    break;
                case "# oven:route:end_pre":
                    route.prepend_content = buffer.join("\n");
                    break;
                case "# oven:route:start_code":
                    buffer = new Array<string>();
                    break;
                case "# oven:route:end_code":
                    route.content = buffer.join("\n");
                    break;
                default:
                    if(line.startsWith("# oven:route:url")) {
                        this.parseUrl(line.replace("# oven:route:url=", ""), route);
                    } else if(line.startsWith("# oven:route:name")) {
                        route.name = line.replace("# oven:route:name=", "");
                    } else {
                        buffer.push(line.replace("    ", ""));
                    }
                    break;
            }
        });
    }
    compileProject(project: Project) {
        let code_file = "";
        project.routes.forEach((route) => {
            code_file += "from flask import Flask\napp = Flask(__name__)\n"
            code_file += "# oven:route:start\n";
            code_file += "# oven:route:start_pre\n";
            code_file += route.prepend_content + "\n";
            code_file += "# oven:route:end_pre\n";
            code_file += "# oven:route:name=" + route.name + "\n";
            code_file += "# oven:route:url=" + route.httpMethod + route.url + "\n";
            code_file += "@app.route(\"" + route.url + "\", methods=['" + route.httpMethod + "'])\n";
            code_file += "def " + route.name + "(" + this.parseParams(route.url).join(", ") + "):\n";
            code_file += "# oven:route:start_code\n";
            route.content.split('\n').forEach(line => {
                code_file += "    " + line + "\n";
            });
            code_file += "# oven:route:end_code\n";
            code_file += "# oven:route:end\n";

            code_file += "if __name__ == '__main__':\n  app.run('0.0.0.0', 80)"
            // TODO: compile documentation
        });
        project.code_file = code_file;
    }
    
}