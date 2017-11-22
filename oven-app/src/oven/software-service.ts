import { Project } from "./models";

export interface SoftwareService {
    parseProject(project: Project);
    compileProject(project: Project);
}