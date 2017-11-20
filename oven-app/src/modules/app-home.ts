import {IDE} from './ide';
import {WelcomePane} from './panes/welcome';
export class AppHome {
  message: string;
  ide: IDE;
  constructor() {
    this.ide = new IDE();
    let welcome = new WelcomePane("");
    let welcome2 = new WelcomePane("Bla");
    this.ide.panes.push(welcome);
    this.ide.panes.push(welcome2);
    this.ide.openPane(welcome);
  }

  attached() {
    //this.ide.attach();
  }
}
