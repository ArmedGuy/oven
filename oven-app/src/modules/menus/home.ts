import {EditorPane} from '../panes/editor-pane';
import {CreateProjectPane} from '../panes/create-project';
import { OpenProjectPane } from '../panes/open-project';
export class HomeMenu {
    availableActions : Array<EditorPane>;
    constructor() {
        this.availableActions = new Array<EditorPane>();    
        let create = new CreateProjectPane();
        this.availableActions.push(create);

        let open = new OpenProjectPane();
        this.availableActions.push(open);
    }
}