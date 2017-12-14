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
    allocations: Array<any>;
    events: Array<any>;

    constructor(project: Project) {
        this.template = "modules/panes/deployment.html";
        this.project = project;
        this.allocations = new Array<any>();
        this.events = new Array<any>();
        this.api = getApi();
        this.fetchDeploymentInfo();
    }

    getEventMessage(event: any) : string {
        let messages = ["DownloadError", "DriverError", "DriverMessage", "KillError", "KillReason", "Message", "RestartReason", "SetupError", "ValidationError"];
        let message = "";
        messages.forEach(msg => {
            messages += event[msg];
        });
        return message;
    }
    fetchDeploymentInfo() {
        this.api.getDeploymentStatus(this.project).then((status) => {
            this.status = status;
        });
        this.api.getDeploymentAllocations(this.project).then((allocations) => {
            this.allocations = new Array<any>();
            allocations.forEach(alloc => {
                this.allocations.push({
                    name: alloc["Name"],
                    version: alloc["JobVersion"],
                    desired: alloc["DesiredStatus"],
                    status: alloc["ClientStatus"]
                });
                let states = alloc['TaskStates'];
                states[states.keys()[0]]['Events'].forEach(event => {
                    this.events.push({
                        type: event['Type'],
                        time: event['Time'],
                        version: alloc["JobVersion"],
                        message: this.getEventMessage(event)
                    });
                });
                
            });
            this.allocations.sort((a, b) => b.version - a.version);
            this.events.sort((a, b) => b.time - a.time);
        });
        setTimeout(this.fetchDeploymentInfo.bind(this), 5000);
    }

    deployProject() {
        this.api.saveProject(this.project).then(() => {   
            this.api.deployProject(this.project);
        })
    }
}