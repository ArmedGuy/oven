window.define('ace/mode/route-url', function(require, exports, module) {
    
    var oop = require("ace/lib/oop");
    var TextMode = require("ace/mode/text").Mode;
    var ExampleHighlightRules = require("ace/mode/route_highlight_rules").ExampleHighlightRules;
    
    var Mode = function() {
        this.HighlightRules = ExampleHighlightRules;
    };
    oop.inherits(Mode, TextMode);
    
    (function() {
        // Extra logic goes here. (see below)
    }).call(Mode.prototype);
    
    exports.Mode = Mode;
});
    
window.define('ace/mode/route_highlight_rules', function(require, exports, module) {
    
    var oop = require("ace/lib/oop");
    var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;
    
    var RouteHighlightRules = function() {
    
        this.$rules = {
            start: [
                {
                    token: ["constant.character", "keyword"],
                    regex: "(/)([a-zA-Z0-9-]+)"
                },
                {
                    token: ["constant.character", "constant.character", "support.type", "constant.character", "variable.other", "constant"],
                    regex: "(/)(<)([a-z]+)(:)([a-zA-Z0-9_]+)(>)"
                }
            ]
        };
    }
    
    oop.inherits(RouteHighlightRules, TextHighlightRules);
    
    exports.ExampleHighlightRules = RouteHighlightRules;
});