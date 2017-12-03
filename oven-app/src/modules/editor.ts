import {EditorPane} from './panes/editor-pane';
import {WelcomePane} from './panes/welcome';
import { Project } from '../oven/models';
import { OvenApi } from '../oven/oven-api';
import { Router, RouterConfiguration } from 'aurelia-router';
import {autoinject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

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
    this.api = new OvenApi;
    this.eventAggregator = eventAggregator;

    let welcome = new WelcomePane();
    this.openPane(welcome);
    
    this.subscribe();
  }

  attached() {
    //this.ide.attach();
  }

  subscribe(): void {
    this.eventAggregator.subscribe('open project', id => {
      this.api.getProject(id).then((project) => {
        this.currentProject = project;
        this.eventAggregator.publish('project loaded', project);
      });
    });
    this.eventAggregator.subscribe('open pane', (pane) => {
      this.openPane(pane);
    });
    this.eventAggregator.subscribe('close pane', (pane) => {
      this.closePane(pane);
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
    this.router.navigateToRoute('project', { id: project.id });
  }
}
