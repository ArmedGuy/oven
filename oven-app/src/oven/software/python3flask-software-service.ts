import { SoftwareService } from "../software-service";
import { Project, Route } from "../models";


export class Python3FlaskSoftwareService implements SoftwareService {
    parseUrl(url_data: string, route: Route) {
        let httpMethod = url_data.split("/", 1)[0];
        route.httpMethod = httpMethod;
        let url = url_data.replace(httpMethod, "");
        route.url = url;
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
                        buffer.push(line);
                    }
                    break;
            }
        });
    }
    compileProject(project: Project) {
        throw new Error("Method not implemented.");
    }
    
}