import {EditorPane} from './editor-pane';

export class WelcomePane implements EditorPane {
    name: string;
    template: string;
    iconName: string;
    iconColor: string;

    constructor() {
        this.name = "Welcome";
        this.template = "modules/panes/welcome.html";
    }
    
    getDisplayName(): string {
        return this.name;
    }
    
}