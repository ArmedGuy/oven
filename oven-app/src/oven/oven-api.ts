import { Project, Account } from "./models";
import environment from '../environment';
import { getService } from "./software-service-factory";
import { HttpClient, json } from "aurelia-fetch-client";
export function getApi() {
    switch(environment.api_type) {
        case 'mock':
            return new MockOvenApi();
        case 'web':
            return new WebOvenApi();
    }
}
export interface OvenApi {
    getRecentProjects(): Promise<Array<Project>>;
    getProject(id: string): Promise<Project>;
    getProjects(): Promise<Array<Project>>;
    saveProject(project: Project) : Promise<any>;
    createProject(id: string, software_id: string, platform_id: string): Promise<Project>;
    getAccount(): Promise<Account>;
    deployProject(project: Project);
    getDeploymentStatus(project: Project) : Promise<any>;
    getDeploymentAllocations(project: Project) : Promise<any>;
}
let projectMappingFields = ["name",
                            "short_description",
                            "software_id",
                            "platform_id",
                            "code_file",
                            "dependencies",
                            "revision",
                            "documentation"];

export class WebOvenApi implements OvenApi {
    client: HttpClient;
    constructor() {
        this.client = new HttpClient;
        this.client.configure((config) => {
            config
                .withBaseUrl(environment.api_path)
                .withDefaults({
                    credentials: "include"
                });
        });
    }

    getRecentProjects(): Promise<Project[]> {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }

    getProject(id: string): Promise<Project> {
        return new Promise<Project>((resolve, reject) => {
            this.client.fetch('projects/' + id, {
                method: 'get'
            }).then(response => response.json())
            .then(response => {
                let p = new Project;
                p._id = response._id["$oid"];
                p.user_id = response.user_id["$oid"];
                projectMappingFields.forEach(field => {
                    p[field] = response[field];
                });
                getService(p.software_id).parseProject(p);
                return p;
            })
            .then(project => resolve(project))
            .catch((error => {
                reject(error);
            }))
        });
        
    }

    getProjects(): Promise<Array<Project>> {
        return new Promise<Array<Project>>((resolve, reject) => {
            this.client.fetch('projects/', {
                method: 'get'
            }).then(response => response.json())
            .then(projects => {
                let newProjects = new Array<Project>();
                projects.forEach(p => {
                    let project = new Project;
                    project._id = p._id["$oid"];
                    project.user_id = p.user_id["$oid"];
                    projectMappingFields.forEach(field => {
                        project[field] = p[field];
                    });
                    newProjects.push(project);
                });
                return newProjects;
            })
            .then(projects => resolve(projects))
            .catch(error => reject(error));
        });
    }

    public saveProject(project: Project) : Promise<any> {
        if(!project._dirty) return;
        return new Promise((resolve, reject) => {
            getService(project.software_id).compileProject(project);
            let sendProject = {};
            projectMappingFields.forEach(field => {
                sendProject[field] = project[field];
            });
            project._dirty = false;
            this.client.fetch("projects/" + project._id, {
                method: 'put',
                body: json(sendProject)
            }).then(response => resolve())
            .catch(error => reject(error));
        });
        
    }

    deployProject(project: Project) {
        this.client.fetch("projects/" + project._id + "/deploy", {
            method: 'post'
        }).then(response => console.log(response));
    }

    getDeploymentStatus(project: Project) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.fetch("projects/" + project._id + "/deployment", {
                method: 'get'
            }).then(response => response.json())
            .then(response => resolve(response))
            .catch(error => reject(error));
        });
    }

    getDeploymentAllocations(project: Project) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.fetch("projects/" + project._id + "/deployment/alloc", {
                method: 'get'
            }).then(response => response.json())
            .then(response => resolve(response))
            .catch(error => reject(error));
        });
    }

    createProject(name: string, software_id: string, platform_id: string): Promise<Project> {
        let project = new Project();
        project.name = name;
        project.software_id = software_id;
        project.platform_id = platform_id;
        return new Promise<Project>((resolve, reject) => {
                this.client.fetch("projects/", {
                    method: 'post',
                    body: json(project)
                }).then(response => response.json())
                .then(response => {
                    project._id = response._id["$oid"];
                    project.user_id = response.user_id["$oid"];
                    projectMappingFields.forEach(field => {
                        project[field] = response[field];
                    });
                    getService(project.software_id).parseProject(project);
                    return project;
                })
                .then(project => resolve(project))
                .catch(error => reject(error));
        });
    }
    getAccount(): Promise<Account> {
        return new Promise<Account>((resolve, reject) => {
            this.client.fetch('account/session', {
                method: 'get'
            }).then(response => response.json())
            .then(account => resolve(account))
            .catch(error => {
                console.log(error);
                reject(error);
            });
        })
    }
}
export class MockOvenApi implements OvenApi {
    static projects: Array<Project> = new Array<Project>();
    constructor() {
        
    }

    getRecentProjects(): Promise<Array<Project>> {
        return new Promise<Array<Project>>((resolve, reject) => {
            resolve(MockOvenApi.projects);
        });
        
    }

    getProject(id: string): Promise<Project> {
        return new Promise<Project>((resolve, reject) => {
            let project = MockOvenApi.projects.filter(x => x._id == id)[0];
            getService(project.software_id).parseProject(project);

            resolve(MockOvenApi.projects.filter(x => x._id == id)[0]);
        });
    }

    getProjects(): Promise<Array<Project>> {
        return new Promise<Array<Project>>((resolve, reject) => {
            resolve(MockOvenApi.projects);
        });
    }

    saveProject(project: Project) : Promise<any> {
        throw new Error("Not implemented");
    }

    deployProject(project: Project) {

    }

    getDeploymentStatus(project: Project) : Promise<any> {
        throw new Error("Not implemented");
    }

    getDeploymentAllocations(project: Project) : Promise<any> {
        throw new Error("Not implemented");
    }

    createProject(name: string, software: string, platform: string) {
        return new Promise<Project>((resolve, reject) => {
            let project = new Project();
            project._id = "blablablabla";
            project.name = name;
            project.software_id = software;
            project.code_file = "";
            MockOvenApi.projects.push(project);
            resolve(project);
        });
    }

    getAccount(): Promise<Account> {
        return new Promise<Account>((resolve, reject) => {
            let loggedIn = window.location.href.indexOf("weblogon.ltu.se") != -1;

            if(loggedIn) {
                let account = new Account;
                account.email = "test@test.com";
                account.username = "test-user";
                account.registered_date = new Date();
                resolve(account);
            } else {
                reject();
            }
        });
    }
}

let project1 = new Project();
project1._id = "bla";
project1.name = "oven-api";
project1.software_id = "python3flask";
project1.code_file = `
# oven:route:start
# oven:route:start_pre
from flask import bla
# oven:route:end_pre
# oven:route:url=POST/user/<path:param1>/<uuid:param2>
# oven:route:name=get_user_by_uuid
@app.route('/user/<path:param1>/<uuid:param2>', methods=['POST'])
def get_user_by_uuid(param1, param2):
# oven:route:start_code
if param1 == param2:
return param1
# oven:route:end_code
# oven:route:end

# oven:route:start
# oven:route:start_pre
# oven:route:end_pre
# oven:route:url=GET/groups/<id>
# oven:route:name=get_group_by_id
@app.route('/groups/<id>', methods=['GET'])
def get_group_by_id(id):
# oven:route:start_code

# oven:route:end_code
# oven:route:end
`;

let project2 = new Project();
project2._id = "blabla";
project2.name = "gpp";

let project3 = new Project();
project3._id = "blablabla";
project3.name = "oven-api2";
project3.software_id = "python3flask";
project3.code_file = "";
MockOvenApi.projects.push(project1, project2, project3);