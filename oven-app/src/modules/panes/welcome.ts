import {EditorPane} from './editor-pane';

export class WelcomePane implements EditorPane {
    name: string;
    template: string;
    

    constructor() {
        this.name = "Welcome";
        this.template = "modules/panes/welcome.html";
    }
    get displayName(): string {
        return this.name;
    }

    get icon(): string {
        return "<i class='fa fa-globe icon-blue'></i>";
    }
    
}