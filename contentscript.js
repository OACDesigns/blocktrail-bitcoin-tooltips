
chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
    //console.log('got a message!', data, sender);
    switch(data.action) {
        case "pay_address_modal":
            $('#btBitTipModal').removeClass().addClass('reveal-modal bt-text-center');
            $('#btBitTipModal .title').text("Scan to make a " + data.network + " payment");
            var content = "<div class='bt-bitcoin-payment-qr'></div>"
                        + "<p><i>" + data.address + "</i></p>"
                        + "<p>Scan the above QR with your wallet to send funds.</p>";
            $('#btBitTipModal .content').html(content);

            //generate the QR code
            var protocol = "bitcoin:";
            if (data.network.toLowerCase() == 'tbtc') {
                protocol = ''
            }
            var options = {
                text: protocol + data.address
            };
            $(".bt-bitcoin-payment-qr").qrcode(options);

            $('#btBitTipModal').reveal({
                animation: 'fadeAndPop',                   //fade, fadeAndPop, none
                animationspeed: 300,                       //how fast animtions are
                closeonbackgroundclick: true,              //if you click background will modal close?
                dismissmodalclass: 'close-reveal-modal'    //the class of a button or element that will close an open modal
            });
            break;
        case "invalid_address_modal":
            $('#btBitTipModal').removeClass().addClass('reveal-modal');
            var content = "<p> The selection <b>'" + data.search + "'</b> is not a valid address.</p>";
            $('#btBitTipModal .title').text("Invalid address");
            $('#btBitTipModal .content').html(content);
            $('#btBitTipModal').reveal({
                animation: 'fadeAndPop',                   //fade, fadeAndPop, none
                animationspeed: 300,                       //how fast animtions are
                closeonbackgroundclick: true,              //if you click background will modal close?
                dismissmodalclass: 'close-reveal-modal'    //the class of a button or element that will close an open modal
            });
            break;
        case "address_qr_modal":
            //chrome.tabs.update(tab.id, {url: "https://www.blocktrail.com"});      //redirect current tab
            chrome.tabs.create({url: blocktrailUrl});        //navigate in new ta
            break;
        default:
            //unhandled message
            console.log('not sure what to do with this message...', data, sender);
    }
});


$(document).ready(function(){
    var bt = new BlocktrailBitTips();
    console.log('Blocktrail browser extension...ready!');

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

    //append the modal window to the body
    var html = '<div id="btBitTipModal" class="reveal-modal"><h1 class="title">Modal Title</h1>'
             + '<div class="content">Any content could go in here.</div><a class="close-reveal-modal">&#215;</a></div>';
    $('body').append(html);

});
