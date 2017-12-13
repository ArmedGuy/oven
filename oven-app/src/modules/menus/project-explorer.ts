import {autoinject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import { RouteConfig } from 'aurelia-router';
import { EditorPane } from '../panes/editor-pane';
import { Project, Route } from '../../oven/models';
import { RoutePane } from '../panes/route-pane';
import {activationStrategy} from 'aurelia-router';

@autoinject
export class ProjectExplorer {
    eventAggregator: EventAggregator;
    projectPanes: Array<EditorPane>;
    project: Project;

    constructor(eventAggregator: EventAggregator) {
        this.eventAggregator = eventAggregator;
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
                let rp = new RoutePane(route, 'python', this.eventAggregator);
                this.projectPanes.push(rp);
            });
        });
        this.eventAggregator.subscribe('delete route', (route) => {
            this.projectPanes.forEach(pane => {
                if(pane instanceof RoutePane) {
                    if(pane.route == route) {
                        let idx = this.projectPanes.indexOf(pane);
                        this.projectPanes.splice(idx, 1);
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
            let rp = new RoutePane(r, 'python', this.eventAggregator);
            this.projectPanes.push(rp);
            this.eventAggregator.publish('open pane', rp);
        }
    }
}