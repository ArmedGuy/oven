import { EditorPane } from "./editor-pane";
import { Route, VariableUrlPart } from "../../oven/models";

declare var ace: any;

export class RoutePane implements EditorPane {
    name: string;
    template: string;
    pre_editor: any;
    main_editor: any;
    get icon(): string {
        return this.route.httpMethod;
    }
    get displayName(): string {
        return `${this.routeUrl}`;
    }

    get routeUrl(): string {
        return this.route.urlParts.map((part) => {
            return (part instanceof VariableUrlPart ? ":" : "") + part.part;
        }).join("/");
    }

    route: Route;
    language: string;
    constructor(route: Route, language: string) {
        this.route = route;
        this.template = "modules/panes/route-pane.html";
        this.language = language;

    }

    attached() {
        console.log("bla");

        this.pre_editor = ace.edit("pre_editor");
        this.pre_editor.setTheme("ace/theme/chaos");
        this.pre_editor.setHighlightActiveLine(false);
        this.pre_editor.setShowPrintMargin(false);
        this.pre_editor.getSession().setMode(`ace/mode/${this.language}`);
        this.pre_editor.setValue(this.route.prepend_content, -1);
        this.pre_editor.setOption("minLines", 3);
        this.pre_editor.setOption("maxLines", 10);

        this.main_editor = ace.edit("main_editor");
        this.main_editor.setTheme("ace/theme/chaos");
        this.main_editor.setHighlightActiveLine(false);
        this.main_editor.setShowPrintMargin(false);
        this.main_editor.getSession().setMode(`ace/mode/${this.language}`);
        this.main_editor.setValue(this.route.content, -1);
        this.main_editor.setOption("minLines", 10);
        this.main_editor.setOption("maxLines", 40);
    }


}