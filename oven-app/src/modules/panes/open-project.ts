import { EditorPane } from "./editor-pane";
import { Project } from "../../oven/models";
import { OvenApi, getApi } from "../../oven/oven-api";
import { EventAggregator } from "aurelia-event-aggregator";
import { Router } from "aurelia-router";


export class OpenProjectPane implements EditorPane {
    name: string;
    template: string;

    api: OvenApi;
    projects: Array<Project>;
    eventAggregator: EventAggregator;
    router: Router;

    constructor(eventAggregator: EventAggregator, router: Router) {
        this.name = "My microservices";
        this.template = "modules/panes/open-project.html";
        this.api = getApi();
        this.eventAggregator = eventAggregator;
        this.router = router;
    }

    attached() {
        this.api.getProjects().then(projects => {
            this.projects = projects;
        });
    }

    get displayName(): string {
        return this.name;
    }

    get icon(): string {
        return "<i class='fa fa-folder-open icon-blue'></i>";
    }

    openProject(project) {
        this.eventAggregator.publish('close pane', this);
        this.router.navigateToRoute("project", { id: project._id });
    }
}