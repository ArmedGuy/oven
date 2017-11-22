import { EditorPane } from "./editor-pane";
import { Route, VariableUrlPart } from "../../oven/models";


export class RoutePane implements EditorPane {
    name: string;
    template: string;
    get icon(): string {
        return this.route.httpMethod;
    }
    get displayName(): string {
        return `${this.routeUrl}`;
    }

    get routeUrl(): string {
        return this.route.urlParts.map((part) => {
            return (part instanceof VariableUrlPart ? ":" : "") + part.part;
        }).join("/");
    }

    route: Route;
    constructor(route: Route) {
        this.route = route;
    }


}