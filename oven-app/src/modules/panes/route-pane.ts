import { EditorPane } from "./editor-pane";
import { Route, Project } from "../../oven/models";
import { EventAggregator } from "aurelia-event-aggregator";

declare var ace: any;

export class RoutePane implements EditorPane {
    template: string;
    pre_editor: any;
    route_editor: any;
    main_editor: any;
    get icon(): string {
        return this.route.httpMethod;
    }
    get displayName(): string {
        if(this.route.url.length > 0)
            return `${this.routeUrl}`;
        return this.name;
    }

    get routeUrl(): string {
        return this.route.url;
    }
    get name(): string {
        return this.route.name;
    }

    eventAggregator: EventAggregator;

    project: Project;
    route: Route;
    language: string;

    example_data: Array<any>;
    constructor(project: Project, route: Route, language: string, eventAggregator: EventAggregator) {
        this.project = project;
        this.route = route;
        this.template = "modules/panes/route-pane.html";
        this.language = language;
        this.eventAggregator = eventAggregator;
    }

    attached() {

        this.pre_editor = ace.edit("pre_editor");
        this.pre_editor.setTheme("ace/theme/chaos");
        this.pre_editor.setHighlightActiveLine(false);
        this.pre_editor.setShowPrintMargin(false);
        this.pre_editor.getSession().setMode(`ace/mode/${this.language}`);
        this.pre_editor.setValue(this.route.prepend_content, -1);
        this.pre_editor.setOption("minLines", 3);
        this.pre_editor.setOption("maxLines", 10);

        this.route_editor = ace.edit("route_editor");
        this.route_editor.setTheme("ace/theme/chaos");
        this.route_editor.setHighlightActiveLine(false);
        this.route_editor.setShowPrintMargin(false);
        this.route_editor.getSession().setMode(`ace/mode/route-url`);
        this.route_editor.setValue(this.route.url, -1);
        this.route_editor.setOption("maxLines", 1);
        this.route_editor.getSession().on('change', (e) => {
            this.project._dirty = true;
            this.route.url = this.route_editor.getValue();
        });
        this.route_editor.renderer.setShowGutter(false);

        this.main_editor = ace.edit("main_editor");
        this.main_editor.setTheme("ace/theme/chaos");
        this.main_editor.setHighlightActiveLine(false);
        this.main_editor.setShowPrintMargin(false);
        this.main_editor.getSession().setMode(`ace/mode/${this.language}`);
        this.main_editor.setValue(this.route.content, -1);
        this.main_editor.getSession().on('change', (e) => {
            this.project._dirty = true;
            this.route.content = this.main_editor.getValue();
        });
        this.main_editor.setOption("minLines", 10);


        // Setup example stuff
        this.example_name = "user";
        this.example_action = "subscribe";
        this.example_related = "friend";
    }


    example_name: string;
    example_action: string;
    example_related: string;

    setupRoute(example: string) {
        let method = "";
        let url = "";
        switch(example) {
            case "basic-add":
                method = "POST";
                url = `/${this.example_name}`;
                break;
            case "basic-get":
                method = "GET";
                url = `/${this.example_name}/<int:id>`;
                break;
            case "basic-update":
                method = "PUT";
                url = `/${this.example_name}/<int:id>`;
                break;
            case "basic-delete":
                method = "DELETE";
                url = `/${this.example_name}/<int:id>`;
                break;
            case "basic-list":
                method = "GET";
                url = `/${this.example_name}s`;
                break;
            case "action":
                method = "POST";
                url = `/${this.example_action}`;
                break;
            case "action-on":
                method = "POST";
                url = `/${this.example_name}/<int:id>/${this.example_action}`;
                break;
            case "related-get":
                method = "GET";
                url = `/${this.example_name}/<int:id>/${this.example_related}s`;
                break;
            case "related-add":
                method = "POST";
                url = `/${this.example_name}/<int:id>/${this.example_related}s`;
                break;
            case "related-delete":
                method = "DELETE";
                url = `/${this.example_name}/<int:id>/${this.example_related}s/<int:${this.example_related}_id>`;
                break;
            case "manual":
                method = "POST";
                url = `/`;
                break;
        }
        this.route.url = url;
        this.route.httpMethod = method;
        this.route_editor.setValue(url, -1);
    }

    deleteRoute() {
        this.eventAggregator.publish('delete route', this.route);
    }
}