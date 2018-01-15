import { EditorPane } from "./editor-pane";
import { Project } from "../../oven/models";
import { OvenApi, getApi } from "../../oven/oven-api";
import { EventAggregator } from "aurelia-event-aggregator";

export class ProjectSettingsPane implements EditorPane {
    name: string;
    template: string;


    get icon(): string {
        return "<i class='fa fa-wrench icon-blue'></i>";
    }
    get displayName(): string {
        return "Settings";
    }
    project : Project;
    
    // Upload environment
    environment : any;
    api : OvenApi;
    eventAggregator : EventAggregator;



    constructor(project: Project, eventAggregator : EventAggregator) {
        this.template = "modules/panes/project-settings.html";
        this.project = project;
        this.eventAggregator = eventAggregator;
        this.api = getApi();
    }

    uploadEnvironment() {
        this.api.uploadProjectEnvironment(this.project, this.environment[0]).then(
            response => {
                alert("Successfully uploaded environment!");
            },
            error => {
                alert("Failed to upload environment: " + error.response);
            }
        )
    }

    removeEnvironment() {
        if(confirm("Are you sure you want to remove the current environment?")) {
            this.api.removeProjectEnvironment(this.project).then(response => {
                    alert("Successfully cleared environment!");
                },
                error => {
                    alert("Failed to clear environment: " + error.response);
                }
            );
        }
    }

    saveProject() {
        this.api.saveProject(this.project).then(response => {
            
        }, error => {
            alert("Failed to save project: " + error.response);
        });
    }

    deleteProject() {
        if(confirm("Are you sure you want to delete '" + this.project.name + "'?")) {
            this.eventAggregator.publish('delete project', this.project);
        }
    }

    
}