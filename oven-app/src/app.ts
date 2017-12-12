import {RouterConfiguration, Router} from 'aurelia-router';
import {Editor} from './modules/editor';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { getApi, OvenApi } from './oven/oven-api';
import environment from './environment';

@inject(Router, EventAggregator)
export class App {
  
  router: RouterConfiguration;
  editor: Editor;
  api: OvenApi;
  loginUrl: string;
  loggedIn: boolean;
  constructor(router: Router, eventAggregator: EventAggregator) {
    this.api = getApi();
    this.loginUrl = "https://weblogon.ltu.se/cas/login?service=" + environment.cas_service_url;
    this.api.getAccount().then((account) => {
      console.log(account);
      if(account) {
        this.loggedIn = true;
        this.editor = new Editor(router, eventAggregator);
      } else {
      }
    }).catch(() => {
        
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
