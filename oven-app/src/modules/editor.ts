import {EditorPane} from './panes/editor-pane';
import {WelcomePane} from './panes/welcome';

export class Editor {
  message: string;
  openPanes: Array<EditorPane>;
  currentPane: EditorPane;
  constructor() {
    this.openPanes = new Array<EditorPane>();

    let welcome = new WelcomePane();
    this.openPane(welcome);

  }

  attached() {
    //this.ide.attach();
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


declare var ace: any;
export class IDE {
    editor: any;

    attach() {
        this.editor = ace.edit("codeEditor");
        this.editor.setTheme("ace/theme/chaos");
        this.editor.setHighlightActiveLine(false);
        this.editor.setShowPrintMargin(false);
        this.editor.getSession().setMode("ace/mode/python");
    }

   
}
