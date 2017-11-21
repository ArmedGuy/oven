import { EditorPane } from "./editor-pane";


export class CreateProjectPane implements EditorPane{
    name: string;
    template: string;
    icon: string;

    constructor() {
        this.name = "Create project";
        this.icon = this.getIcon();
        this.template = "modules/panes/create-project.html";
    }

    getDisplayName(): string {
        return this.name;
    }

    getIcon(): string {
        return "<i class='fa fa-plus icon-blue'></i>";
    }
}