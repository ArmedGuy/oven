import { EditorPane } from "./editor-pane";
import { Project } from "../../oven/models";
import { OvenApi, getApi } from "../../oven/oven-api";
import { EventAggregator } from "aurelia-event-aggregator";

declare var showdown : any;

export class DocumentationPane implements EditorPane {
    name: string;
    template: string;


    get icon(): string {
        return "<i class='fa fa-file-text-o icon-blue'></i>";
    }
    get displayName(): string {
        return "Documentation";
    }
    project : Project;
    
    routes : string;
    description : string;

    converter : any;


    constructor(project: Project) {
        this.template = "modules/panes/project-documentation.html";
        this.project = project;
        this.converter = new showdown.Converter();
        let update = function() {
            this.description = this.converter.makeHtml(this.project.description);
            this.routes = this.converter.makeHtml(this.project.documentation);
            setTimeout(update.bind(this), 5000);
        };
        update.bind(this)();
    }
}