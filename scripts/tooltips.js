
chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
    //console.log('tooltips: got a message!', data, sender);
    switch(data.action) {
        case "request_tooltip_count":
            //count the total number of tooltips found on the page and return to sender
            var responseData = {
                btc_tooltips_count: $('.bt-bitcoin-tooltip[data-network="btc"]').length,
                tbtc_tooltips_count: $('.bt-bitcoin-tooltip[data-network="tbtc"]').length
            };

            sendResponse(responseData);
            break;
        default:
            //unhandled message
            console.log('tooltips: not sure what to do with this message...', data, sender);
    }

    //keep the message channel open for other handlers to send a response
    return true;
});


$(document).ready(function(){
    var bt = new BlocktrailBitTips();
    console.log('Blocktrail tooltips extension...ready!');

    //scan the page and setup tooltips for any bitcoin/testnet addresses
    bt.scan();

    //on activate tab, set rescan interval
    //chrome.tabs.onActivated.addListener(function (activeInfo) {
    //    console.log('tab activated', activeInfo);
    //});

    var rescan = setInterval(function() {
        //console.log('rescan');
        bt.scan();
    }, 1000);

    // on deactivate tab clearInterval(rescan);
    //...
});