import {autoinject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import { RouteConfig } from 'aurelia-router';
import { EditorPane } from '../panes/editor-pane';
import { Project, Route } from '../../oven/models';
import { RoutePane } from '../panes/route-pane';
import {activationStrategy} from 'aurelia-router';
import { DeploymentPane } from '../panes/deployment';
import { ProjectSettingsPane } from '../panes/project-settings';
import { DocumentationPane } from '../panes/project-documentation';

@autoinject
export class ProjectExplorer {
    eventAggregator: EventAggregator;
    routePanes: Array<EditorPane>;
    projectPanes: Array<EditorPane>;
    project: Project;

    constructor(eventAggregator: EventAggregator) {
        this.eventAggregator = eventAggregator;
        this.routePanes = new Array<EditorPane>();
        this.projectPanes = new Array<EditorPane>();
        this.subscribe();
    }

    determineActivationStrategy() {
        return activationStrategy.replace;
    }

    subscribe() {
        this.eventAggregator.subscribe('project loaded', (project: Project) => {
            this.project = project;
            project.routes.forEach((route: Route) => {
                console.log(this.eventAggregator);
                let rp = new RoutePane(this.project, route, 'python', this.eventAggregator);
                this.routePanes.push(rp);
            });

            this.projectPanes.push(new ProjectSettingsPane(this.project, this.eventAggregator));
            this.projectPanes.push(new DeploymentPane(this.project));
            this.projectPanes.push(new DocumentationPane(this.project));

        });
        this.eventAggregator.subscribe('delete route', (route) => {
            this.routePanes.forEach(pane => {
                if(pane instanceof RoutePane) {
                    if(pane.route == route) {
                        let idx = this.routePanes.indexOf(pane);
                        this.routePanes.splice(idx, 1);
                    }
                }
            });
        });
    }

    activate(params: any, routeConfig: RouteConfig) {
        setTimeout(() => {
            this.eventAggregator.publish('open project', params.id);
        }, 300);
    }

    created() {

    }

    addNewRoute() {
        if(this.project) {
            let r = new Route();
            let name = "new_route";
            let i = 1;
            this.project.routes.forEach((route) => {
                if(route.name == name) {
                    name = `new_route${i++}`;
                }
            });
            r.name = name;
            this.project.routes.push(r);
            let rp = new RoutePane(this.project, r, 'python', this.eventAggregator);
            this.routePanes.push(rp);
            this.project._dirty = true;
            this.eventAggregator.publish('open pane', rp);
        }
    }
}