import {EditorPane} from './editor-pane';

export class WelcomePane implements EditorPane {
    name: string;
    template: string;
    icon: string;

    constructor() {
        this.name = "Welcome";
        this.template = "modules/panes/welcome.html";
        this.icon = this.getIcon();
    }

    getDisplayName(): string {
        return this.name;
    }

    getIcon(): string {
        return "<i class='fa fa-globe icon-blue'></i>";
    }
    
}