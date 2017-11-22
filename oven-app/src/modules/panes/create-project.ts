import { EditorPane } from "./editor-pane";


export class CreateProjectPane implements EditorPane{
    name: string;
    template: string;

    constructor() {
        this.name = "Create project";
        this.template = "modules/panes/create-project.html";
    }

    get displayName(): string {
        return this.name;
    }

    get icon(): string {
        return "<i class='fa fa-plus icon-blue'></i>";
    }
}