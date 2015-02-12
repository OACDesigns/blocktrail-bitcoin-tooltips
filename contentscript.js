

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
});
