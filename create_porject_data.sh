#!/bin/bash
curl -X POST -d "software_id=1&platform_id=1&shortName=test&description=test&shortDescription=test&codeFile=none&dependencies=none&revision=0.0.1" 127.0.0.1:5555/projects/create/superservice
