define([
    "/jquery.js"
    ], function() {
    var self;

    function init(config) {
        self = this;
        self.link("applications", function(err, data) {
            if(err) return showError(err);
            buildTable(data);
        });
    }
    
    function buildTable(apps) {   
        var template = $(".template");
        var tbody = $("#appsTable").find("tbody");
        for(var i in apps) {
            var app = apps[i];
            var tr = template.clone().show();
            tr.attr("id", app.id);
            tr.find('.name').find("a").html(app.name);
            tbody.append(tr);
        }
    }
    
    function showError(err) {
        $("#errorAlert").text(err).show();
    }
    
    return init;
});


