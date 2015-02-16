/*
    injects an iframe into the page to keep all css styling separated for our modal window
    also controls when it's displayed/hidden via message listeners
*/


chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
    console.log('iframe injector got a message!', data, sender);
    switch(data.action) {
        case "show_iframe":
            $('#blocktrail_modal_iframe').addClass('show-iframe');
            break;
        case "hide_iframe":
            $('#blocktrail_modal_iframe').removeClass('show-iframe');
            break;
        default:
            break;
    }
});

$(document).ready(function(){

    console.log('modal injector loaded');
    //create a modal window with an injected iFrame

    var iFrame  = $('<iframe id="blocktrail_modal_iframe" />').attr('src', chrome.extension.getURL("templates/blocktrail_modal.html"));
    $('body').append(iFrame);

    //register a message handler to display/hide the iframe
    window.onmessage = function(event){
        console.log('iframe message', event);
        switch(event.data.action) {
            case "show_iframe":
                $('#blocktrail_modal_iframe').addClass('show-iframe');
                break;
            case "hide_iframe":
                $('#blocktrail_modal_iframe').removeClass('show-iframe');
                break;
            default:
                break;
        }
    };

    /*

     //document.body.insertBefore(iFrame, document.body.firstChild);
     //append the modal window to the body
     var modalHTML = '<div id="btBitTipModal" class="reveal-modal"><h1 class="title">Modal Title</h1>'
     + '<div class="content">Any content could go in here.</div><a class="close-reveal-modal">&#215;</a></div>';
     var modal = $(modalHTML).append(iFrame);
     $('body').append(modal);
     */

    //append the modal template to the page
    //var modal = $
    //$('body').append(modal);

    //append the modal element to the body
    //var modalHTML = '<div id="btBitTipModal" class="reveal-modal"><h1 class="title">Modal Title</h1>'
    //    + '<div class="content">Any content could go in here.</div><a class="close-reveal-modal">&#215;</a></div>';
    //var modal = $(modalHTML).append(iFrame);
    //$('body').append(modal);
});
