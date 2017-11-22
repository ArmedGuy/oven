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

    constructor(eventAggregator: EventAggregator) {
        this.eventAggregator = eventAggregator;
        this.projectPanes = new Array<EditorPane>();
        this.subscribe();
    }

    subscribe() {
        this.eventAggregator.subscribe('project loaded', (project: Project) => {
            project.routes.forEach((route: Route) => {
                let rp = new RoutePane(route);
                this.projectPanes.push(rp);
            });
        });
    }

    activate(params: any, routeConfig: RouteConfig) {
        this.eventAggregator.publish('open project', params.id);
    }
}