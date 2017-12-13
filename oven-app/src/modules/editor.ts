import {EditorPane} from './panes/editor-pane';
import {WelcomePane} from './panes/welcome';
import { Project, Route } from '../oven/models';
import { OvenApi, getApi } from '../oven/oven-api';
import { Router, RouterConfiguration } from 'aurelia-router';
import {autoinject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import { RoutePane } from './panes/route-pane';

export class Editor {
  router: Router;
  openPanes: Array<EditorPane>;
  currentPane: EditorPane;
  api: OvenApi;
  eventAggregator: EventAggregator;

  currentProject: Project;
  constructor(router: Router, eventAggregator: EventAggregator) {
    this.router = router;
    this.openPanes = new Array<EditorPane>();
    this.api = getApi();
    this.eventAggregator = eventAggregator;

    let welcome = new WelcomePane();
    this.openPane(welcome);
    
    let saveProject = () => {
        this.eventAggregator.publish('save project');
        setTimeout(saveProject, 15000);
    };
    saveProject();
    this.subscribe();
  }

  attached() {
    //this.ide.attach();
  }

  subscribe(): void {
    this.eventAggregator.subscribe('open project', id => {
      this.openPanes.forEach(pane => {
        if(pane instanceof RoutePane) {
          this.closePane(pane);
        }
      })
      this.api.getProject(id).then((project) => {
        this.currentProject = project;
        this.eventAggregator.publish('project loaded', project);
      });
    });
    this.eventAggregator.subscribe('save project', () => {
      if(this.currentProject != null) {
        console.log("save project");
        this.api.saveProject(this.currentProject);
      }
    });
    this.eventAggregator.subscribe('open pane', (pane) => {
      this.openPane(pane);
    });
    this.eventAggregator.subscribe('close pane', (pane) => {
      this.closePane(pane);
    });
    this.eventAggregator.subscribe('delete route', (route) => {
      this.deleteRoute(route);
    });
    this.eventAggregator.subscribe('deploy project', (project) => {
      this.deployProject(this.currentProject);
    });
  }

  openPane(pane: EditorPane) {
    if(this.openPanes.indexOf(pane) > -1)
    {
        this.currentPane = pane;
        return;
    }
    this.openPanes.push(pane);
    this.currentPane = pane;
  }

  closePane(pane: EditorPane) {
    let index = this.openPanes.indexOf(pane);
    if(index - 1 <= -1) {
      this.currentPane = null;
    } else {
      this.currentPane = this.openPanes[index-1];
    }
    if(this.currentPane == null) {
      if(index + 1 < this.openPanes.length) {
        this.currentPane = this.openPanes[index+1];
      }
    }
    this.openPanes.splice(index, 1);
  }

  openProject(project: Project) {
    this.currentProject = project;
    this.router.navigateToRoute('project', { id: project._id });
  }

  deployProject(project: Project) {
    console.log("deploying");
    this.api.deployProject(project);
  }

  deleteRoute(route: Route) {
    if(confirm("Are you sure you want to delete " + route.name + "?")) {
      this.openPanes.forEach(pane => {
        if(pane instanceof RoutePane) {
          if(pane.route == route) {
            this.closePane(pane);
          }
        }
      });
      let idx = this.currentProject.routes.indexOf(route);
      this.currentProject.routes.splice(idx, 1);
    }
  }
}
