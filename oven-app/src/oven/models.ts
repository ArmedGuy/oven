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
    id: string;
    name: string;
    short_name: string;
    short_description: string;
    user_id: string;
    group_id: string;
    software_id: string;
    platform_id: string;
    code_file: string;
    dependencies: string;
    revision: number;
    documentation: string;

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