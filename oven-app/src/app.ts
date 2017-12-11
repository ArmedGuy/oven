import {RouterConfiguration, Router} from 'aurelia-router';
import {Editor} from './modules/editor';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { getApi, OvenApi } from './oven/oven-api';

@inject(Router, EventAggregator)
export class App {
  
  router: RouterConfiguration;
  editor: Editor;
  api: OvenApi;
  constructor(router: Router, eventAggregator: EventAggregator) {
    this.api = getApi();
    this.api.getAccount().then((account) => {
      this.editor = new Editor(router, eventAggregator);
    }).catch(() => {
        window.location.href = "https://weblogon.ltu.se/cas/login?service=" + location.href;
    });
  }
  
  configureRouter(config, router){
    config.title = 'Oven';
    config.map([
      { route: '', moduleId: 'modules/menus/home' , title: 'Home' },
      { route: 'projects/', moduleId: 'modules/menus/home', title: 'Project' },
      { name: 'project', route: 'projects/:id', moduleId: 'modules/menus/project-explorer', title: 'IDE' },
      { route: 'deployments/', moduleId: 'modules/menus/deploy', title: 'Deployments' }
    ]);

    this.router = router;
  }
}
