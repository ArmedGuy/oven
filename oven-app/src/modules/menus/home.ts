import {EditorPane} from '../panes/editor-pane';
import {CreateProjectPane} from '../panes/create-project';
import { OpenProjectPane } from '../panes/open-project';
import {OvenApi} from '../../oven/oven-api';
import {Project} from '../../oven/models';

export class HomeMenu {
    availableActions : Array<EditorPane>;
    api: OvenApi;

    recentProjects: Array<Project>;

    constructor() {
        this.availableActions = new Array<EditorPane>();    
        let create = new CreateProjectPane();
        this.availableActions.push(create);

        let open = new OpenProjectPane();
        this.availableActions.push(open);

        this.api = new OvenApi;

        this.api.getRecentProjects().then((projects) => {
            this.recentProjects = projects;
        });

    }
}