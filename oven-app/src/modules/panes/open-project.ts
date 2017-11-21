import { EditorPane } from "./editor-pane";


export class OpenProjectPane implements EditorPane {
    name: string;
    template: string;
    icon: string;

    constructor() {
        this.name = "Open project";
        this.icon = this.getIcon();
        this.template = "modules/panes/open-project.html";
    }

    getDisplayName(): string {
        return this.name;
    }

    getIcon(): string {
        return "<i class='fa fa-folder-open icon-blue'></i>";
    }
}