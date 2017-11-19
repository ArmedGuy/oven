declare var ace: any;

export class AppHome {
  message: string;
  editor: any;
  constructor() {
    
  }

  attached() {
    this.editor = ace.edit("codeEditor");
    this.editor.setTheme("ace/theme/chaos");
    this.editor.getSession().setMode("ace/mode/python");
  }
}
