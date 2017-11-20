import {IDE} from './ide';
import {WelcomePane} from './panes/welcome';
export class AppHome {
  message: string;
  ide: IDE;
  constructor() {
    this.ide = new IDE();
    let welcome = new WelcomePane;
    this.ide.panes.push(welcome);
    this.ide.openPane(welcome);
  }
  
  attached() {
    //this.ide.attach();
  }
}
