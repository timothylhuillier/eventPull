    $(document).ready(function() {

        var people = chrome.extension.getBackgroundPage().people;

        if(people)
        {

        var output = document.getElementById('output');


        $("#demo-input-local-custom-formatters").tokenInput(people, {
              propertyToSearch: "name",
              resultsFormatter: function(item){ return "<li>" + "<img src='" + item.url + "' title='" + item.name + "' height='25px' width='25px' />" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" + item.name + "</div><div class='email'>" + item.email + "</div><div class='phone'>" + item.phone + "</div></div></li>" },
              tokenFormatter: function(item) { return "<li><p>" + item.name + "</p></li>" },
              theme: "facebook",
          });

        var my_chrome = chrome;

        $("input[type=button]").click(function () {
            var results = $("#demo-input-local-custom-formatters").tokenInput("get");
            $("#output").html(results[0]["name"]);
            my_chrome.extension.getBackgroundPage().sendSms();
        });

    }

    });