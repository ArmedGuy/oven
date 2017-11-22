import { EditorPane } from "./editor-pane";


export class OpenProjectPane implements EditorPane {
    name: string;
    template: string;

    constructor() {
        this.name = "Open project";
        this.template = "modules/panes/open-project.html";
    }

    get displayName(): string {
        return this.name;
    }

    get icon(): string {
        return "<i class='fa fa-folder-open icon-blue'></i>";
    }
}