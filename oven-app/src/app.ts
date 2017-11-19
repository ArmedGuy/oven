import {RouterConfiguration} from 'aurelia-router';
export class App {
  router: RouterConfiguration;
  configureRouter(config, router){
    config.title = 'Oven';
    config.map([
      { route: '',              moduleId: 'modules/app-home',       title: 'Home' },
    ]);

    this.router = router;
  }
}
