import {RouterConfiguration} from 'aurelia-router';
import {Editor} from './modules/editor';

export class App {
  
  router: RouterConfiguration;
  editor: Editor;
  
  constructor() {
    this.editor = new Editor();
  }
  
  configureRouter(config, router){
    config.title = 'Oven';
    config.map([
      { route: '', moduleId: 'modules/menus/home' , title: 'Home' },
      { route: 'projects/', moduleId: 'modules/menus/home', title: 'Project' },
      { route: 'projects/:id', moduleId: 'modules/menus/project', title: 'IDE' },
      { route: 'deployments/', moduleId: 'modules/menus/deploy', title: 'Deployments' }
    ]);

    this.router = router;
  }
}
