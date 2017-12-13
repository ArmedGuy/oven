import { EditorPane } from '../panes/editor-pane';
import { CreateProjectPane } from '../panes/create-project';
import { OpenProjectPane } from '../panes/open-project';
import { OvenApi, getApi } from '../../oven/oven-api';
import { Project } from '../../oven/models';
import { autoinject, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

@inject(EventAggregator, Router)
export class HomeMenu {
    availableActions : Array<EditorPane>;
    api: OvenApi;

    recentProjects: Array<Project>;

    constructor(eventAggregator: EventAggregator, router: Router) {
        this.availableActions = new Array<EditorPane>();    
        let create = new CreateProjectPane(eventAggregator, router);
        this.availableActions.push(create);

        let open = new OpenProjectPane(eventAggregator, router);
        this.availableActions.push(open);

        this.api = getApi();

        this.api.getRecentProjects().then((projects) => {
            this.recentProjects = projects;
        });

    }
}