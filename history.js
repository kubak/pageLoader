var PageLoader = {
    currentURL : false,
    loadContent : function (url) {
        PageLoader.currentURL = url;
        $.get(url, function (data) {
            $("#mainContent").html($("#mainContent", data).html()); // replace page content
            $("#mainContent a").click(PageLoader.linkClick); // attach to the newly added content
            if ((window.history && history.pushState)) { // check for browser support
                history.pushState(null, null, url); // html5 history api
            } else {
                window.location = '#' + url; // degrade gracefully
            }
        });
    },
    linkClick : function(e) {
        var url = $(this).attr('href');
        // check for absolute links and https
        if (url.match(/^https:\/\/|^http:\/\//) === null) { 
            e.preventDefault();
            PageLoader.loadContent(url);
            return false;
        }
    },
    hashChange : function () {
        console.log(PageLoader.currentURL);
        if (!PageLoader.currentURL) {
            return;
        }
        var locationMatch = window.location.hash.replace('#', '');
        if (locationMatch == '') {
            locationMatch = window.location.href.match(/[^\/]+\.html$/); // 
            if (locationMatch !== null) {
                locationMatch = locationMatch[0]; // retrieve match
            }
        }
        if (locationMatch != PageLoader.currentURL) {
            PageLoader.loadContent(locationMatch);
        }
    }
};
// handle bookmarks and hand typed urls for urls with #
var locationMatch = window.location.hash.replace('#', '');
if (locationMatch != '') {
    PageLoader.loadContent(locationMatch);
}

$(document).ready(function () { 
    $('a').click(PageLoader.linkClick);
    // back/forward buttons
    // bind this after document ready because it fires one time before and we don't want that
    $(window).on('popstate', PageLoader.hashChange);
    // handle older MSIE - using a plugin like this one would be a good idea
    // https://github.com/cowboy/jquery-hashchange/tree/v1.3
    setInterval(PageLoader.hashChange, 100);
});
