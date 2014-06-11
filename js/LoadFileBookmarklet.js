function LoadFileBookmarklet(url){

    function attachFile(filename) {
        var dotIndex = filename.lastIndexOf('.');
        var filetype = filename.substring(dotIndex + 1);
        if (filetype=="js"){ //if filename is a external JavaScript file
            var fileref=document.createElement('script');
                fileref.setAttribute("type","text/javascript");
                fileref.setAttribute("src", filename);
        } else if (filetype=="css"){ //if filename is an external CSS file
            var fileref=document.createElement("link");
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", filename);
        }
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref);
        else
            alert('The filepath ('
                    + filename 
                    + ') uses an unsupported filetype.' 
                    + ' Be sure to end the filepath in .css/.js/etc');
    }

    if(typeof url == "undefined" || url == null) {
        var baseUrl = "http://mathbook.staging.michaeldubois.me/";
        var branch = "master";
        url = baseUrl + branch + "/" + "stylesheets/mathbook-modern.css";
        url = prompt("What's the url of the file?", url);
    }

    if(url != null)
        attachFile(url);

}
