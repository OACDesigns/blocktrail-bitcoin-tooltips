$(document).ready(function(){
    var bt = new BlocktrailBitTips();
    console.log('Blocktrail tooltips extension...ready!');

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
