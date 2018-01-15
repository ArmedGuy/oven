import {EditorPane} from './panes/editor-pane';
import {WelcomePane} from './panes/welcome';
import { Project, Route } from '../oven/models';
import { OvenApi, getApi } from '../oven/oven-api';
import { Router, RouterConfiguration } from 'aurelia-router';
import {autoinject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import { RoutePane } from './panes/route-pane';
import { ProjectSettingsPane } from './panes/project-settings';
import { DeploymentPane } from './panes/deployment';

export class Editor {
  router: Router;
  openPanes: Array<EditorPane>;
  currentPane: EditorPane;
  api: OvenApi;
  eventAggregator: EventAggregator;

  currentProject: Project;

  projectStatus : string;
  projectStatusColor : string;

  constructor(router: Router, eventAggregator: EventAggregator) {
    this.router = router;
    this.openPanes = new Array<EditorPane>();
    this.api = getApi();
    this.eventAggregator = eventAggregator;

    let welcome = new WelcomePane();
    this.openPane(welcome);
    
    let saveProject = () => {
        this.eventAggregator.publish('save project');

        setTimeout(saveProject, 5000);
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
        this.api.saveProject(this.currentProject).then(response => {
          this.projectStatus = "Project saved!";
          this.projectStatusColor = "ide-background-primary";
          setTimeout(function() {
            this.projectStatus = "";
            this.projectStatusColor = "";
          }.bind(this), 1500);
        }, error => {
          this.projectStatus = "Failed to save project: " + error.response;
          this.projectStatusColor = "ide-background-danger";
        });
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
    this.eventAggregator.subscribe('delete project', project => {
      this.deleteProject(project);
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
      this.currentProject._dirty = true;
    }
  }

  deleteProject(project : Project) {
    this.api.deleteProject(project).then(response => {
      if(this.currentProject == project) {
        this.currentProject = null;
        this.currentPane = null;
        this.openPanes.forEach(pane => {
          this.closePane(pane);
        });
      }
      this.projectStatus = "";
      this.projectStatusColor = "";
      this.router.navigateToRoute('home');
    }, error => {
      alert("Failed to delete project " + project.name + ", reason: " + error.response);
    });
  }
}
