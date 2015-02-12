
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

    //append the modal window to the body

    var html = '<div id="myModal" class="reveal-modal"><h1>Modal Title</h1><p>Any content could go in here.</p>'
             + '<a class="close-reveal-modal">&#215;</a></div>'

    chrome.runtime.sendMessage({data: 'hello world!', from: "content"});
});
