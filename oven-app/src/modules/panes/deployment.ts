import { EditorPane } from "./editor-pane";
import { Project } from "../../oven/models";
import { getApi, OvenApi } from "../../oven/oven-api";
import { EventAggregator } from "aurelia-event-aggregator";

export class DeploymentPane implements EditorPane {
    name: string;
    template: string;
    api: OvenApi;
    get icon(): string {
        return "<i class='fa fa-server icon-blue'></i>";
    }
    get displayName(): string {
        return "Deployment";
    }
    
    project: Project;
    status: any;

    constructor(project: Project) {
        this.template = "modules/panes/deployment.html";
        this.project = project;
        this.api = getApi();
        this.fetchDeploymentInfo();
    }

    fetchDeploymentInfo() {
        this.api.getDeploymentStatus(this.project).then((status) => {
            this.status = status;
        });
        setTimeout(this.fetchDeploymentInfo.bind(this), 5000);
    }

    deployProject() {
        this.api.saveProject(this.project).then(() => {   
            this.api.deployProject(this.project);
        })
    }
}