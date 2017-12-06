import { EditorPane } from "./editor-pane";


export class NewProjectPane implements EditorPane {
    name: string;
    template: string;

    constructor() {
        this.name = "Your new project";
        this.template = "modules/panes/new-project.html";
    }

    get displayName(): string {
        return this.name;
    }

    get icon(): string {
        return "<i class='fa fa-fire icon-blue'></i>";
    }
}