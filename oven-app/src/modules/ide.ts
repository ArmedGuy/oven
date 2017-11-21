import {EditorPane} from './panes/editor-pane';
declare var ace: any;
export class IDE {
    editor: any;
    openPanes: Array<EditorPane>;
    currentPane: EditorPane;

    constructor() {
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
        if(this.openPanes.indexOf(pane) > -1)
        {
            this.currentPane = pane;
            return;
        }
        this.openPanes.push(pane);
        this.currentPane = pane;

    }
}