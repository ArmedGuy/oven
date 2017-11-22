import { Project } from "./models";
import { SoftwareService } from "./software-service";
import { Python3FlaskSoftwareService } from "./software/python3flask-software-service";
import { DotnetCoreSoftwareService } from "./software/dotnetcore-software-service";


export function getService(software_id: string) : SoftwareService {
    switch(software_id) {
        case "python3flask":
            return new Python3FlaskSoftwareService();
        case "dotnetcore":
            return new DotnetCoreSoftwareService();
        default:
            throw new Error("Unknown service requested")
    }
}