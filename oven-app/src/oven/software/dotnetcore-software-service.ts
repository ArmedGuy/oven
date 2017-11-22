import { SoftwareService } from "../software-service";
import { Project } from "../models";


export class DotnetCoreSoftwareService implements SoftwareService {
    parseProject(project: Project) {
        throw new Error("Method not implemented.");
    }
    compileProject(project: Project) {
        throw new Error("Method not implemented.");
    }
    
}