export interface UrlPart {
    part: string;
}
export class StaticUrlPart implements UrlPart {
    part: string;

    constructor(part: string) {
        this.part = part;
    }
}
export class VariableUrlPart implements UrlPart {
    part: string;
    type: string;
}
export class Route {
    name: string;
    httpMethod: string;
    urlParts: Array<UrlPart>;
    prepend_content: string;
    content: string;
    constructor() {
        this.urlParts = new Array<UrlPart>();
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