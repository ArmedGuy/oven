import { EditorPane } from "./editor-pane";
import { OvenApi, getApi } from "../../oven/oven-api";

import {EventAggregator} from 'aurelia-event-aggregator';
import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { NewProjectPane } from "./new-project";

export class CreateProjectPane implements EditorPane{
    name: string;
    template: string;
    eventAggregator: EventAggregator;
    router: Router;

    api: OvenApi;
    

    constructor(eventAggregator: EventAggregator, router: Router) {
        this.name = "New microservice";
        this.template = "modules/panes/create-project.html";
        this.eventAggregator = eventAggregator;
        this.router = router;

        this.api = getApi();
    }

    get displayName(): string {
        return this.name;
    }

    get icon(): string {
        return "<i class='fa fa-plus icon-blue'></i>";
    }

    projectName: string;

    software: string;
    setSoftware(software_id: string) {
        this.software = software_id;
    }

    platform: string;
    setPlatform(platform_id: string) {
        this.platform = platform_id;
    }

    createProject() {
        this.api.createProject(this.projectName, this.software, this.platform).then((project) => {
            this.eventAggregator.publish('close pane', this);
            console.log(project);
            this.router.navigateToRoute("project", { id: project._id });
            this.eventAggregator.publish('open pane', new NewProjectPane);
        });
    }
    
}