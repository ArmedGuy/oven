import {EditorPane} from './panes/editor-pane';
declare var ace: any;
export class IDE {
    editor: any;
    public panes: Array<EditorPane>;
    openPanes: Array<EditorPane>;
    currentPane: EditorPane;

    constructor() {
        this.panes = new Array<EditorPane>();
        this.openPanes = new Array<EditorPane>();
    }

    attach() {
        this.editor = ace.edit("codeEditor");
        this.editor.setTheme("ace/theme/chaos");
        this.editor.setHighlightActiveLine(false);
        this.editor.setShowPrintMargin(false);
        this.editor.getSession().setMode("ace/mode/python");
    }

    openPane(pane: EditorPane) {
        if(this.panes.indexOf(pane) <= -1)
            return;
        if(this.openPanes.indexOf(pane) > -1)
        {
            this.currentPane = pane;
            return;
        }
        this.openPanes.push(pane);
        this.currentPane = pane;

    }
}