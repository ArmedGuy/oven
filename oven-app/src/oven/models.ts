export class Route {
    name: string;
    httpMethod: string;
    url: string;
    prepend_content: string;
    content: string;
    constructor() {
        this.name = "new_route";
        this.url = "";
        this.httpMethod = "GET";
        this.content = "";
        this.prepend_content = "";
    }
}
export class Project {
    _id: any;
    name: string;
    description : string;
    short_description: string;
    user_id: string;
    software_id: string;
    platform_id: string;
    code_file: string;
    revision: number;
    documentation: string;
    environment_id: any;

    // Generated values
    parsed: boolean;
    _dirty: boolean;
    routes: Array<Route>;
}

export class Account {
    id: string;
    username: string;
    email: string;
    registered_date: Date;

    _dirty: boolean;
}