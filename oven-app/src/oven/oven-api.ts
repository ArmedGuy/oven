import { Project, Account } from "./models";
import environment from '../environment';
import { getService } from "./software-service-factory";
import { access } from "fs";
export function getApi() {
    switch(environment.api_type) {
        case 'mock':
            return new MockOvenApi();
    }
}
export interface OvenApi {
    getRecentProjects(): Promise<Array<Project>>;
    getProject(id: string): Promise<Project>;
    createProject(id: string, software_id: string, platform_id: string): Promise<Project>;
    getAccount(): Promise<Account>;
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
            let project = MockOvenApi.projects.filter(x => x.id == id)[0];
            getService(project.software_id).parseProject(project);

            resolve(MockOvenApi.projects.filter(x => x.id == id)[0]);
        });
    }

    createProject(name: string, software: string, platform: string) {
        return new Promise<Project>((resolve, reject) => {
            let project = new Project();
            project.id = "blablablabla";
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
project1.id = "bla";
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
project2.id = "blabla";
project2.name = "gpp";

let project3 = new Project();
project3.id = "blablabla";
project3.name = "oven-api2";
project3.software_id = "python3flask";
project3.code_file = "";
MockOvenApi.projects.push(project1, project2, project3);