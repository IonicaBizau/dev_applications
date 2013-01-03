define([
    "/jquery.js"
    ], function() {
    var self;

    function init(config) {
        self = this;
        debugger;
        self.link("applications", function(data) {
            buildTable(data);
        });
    }
    return init;
});

function buildTable(apps) {   
    var template = $(".template");
    var tbody = $("#appsTable").find("tbody");
    for(var i in apps) {
        var app = apps[i];
        var tr = template.clone();
        tr.attr = app.id;
        tr.find('.name').find("a").html(app.name);
        tbody.append(tr);
    }
}
