import {autoinject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import { RouteConfig } from 'aurelia-router';
import { EditorPane } from '../panes/editor-pane';
import { Project, Route } from '../../oven/models';
import { RoutePane } from '../panes/route-pane';

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

    subscribe() {
        this.eventAggregator.subscribe('project loaded', (project: Project) => {
            this.project = project;
            project.routes.forEach((route: Route) => {
                let rp = new RoutePane(route, 'python');
                this.projectPanes.push(rp);
            });
        });
    }

    activate(params: any, routeConfig: RouteConfig) {
        this.eventAggregator.publish('open project', params.id);
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
            let rp = new RoutePane(r, 'python');
            this.projectPanes.push(rp);
            this.eventAggregator.publish('open pane', rp);
        }
    }
}