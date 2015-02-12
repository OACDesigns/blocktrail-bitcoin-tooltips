
chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
    console.log('got a message!', data, sender);
});


$(document).ready(function(){
    var bt = new BlocktrailBitTips();
    console.log('Blocktrail browser extension...ready!');

    bt.scan();

    //on activate tab, set rescan interval
    var rescan = setInterval(function() {
        //console.log('rescan');
        bt.scan();
    }, 1000);

    // on deactivate tab clearInterval(rescan);
    //...



    chrome.runtime.sendMessage({data: 'hello world!', from: "content"});
});
