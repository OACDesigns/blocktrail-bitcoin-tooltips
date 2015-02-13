
chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
    console.log('got a message!', data, sender);
    switch(data.action) {
        case "pay_address_modal":
            $('#myModal .title').text("Make a " + data.network + " Payment");
            $('#myModal .subtitle').text(data.address);
            var content = "<img src='" + data.QR + "' >"
                        + "<p>This is a " + data.network + " address. Scan the above QR with a wallet to send funds to it.</p>";
            $('#myModal .content').html(content);
            $('#myModal').reveal({
                animation: 'fadeAndPop',                   //fade, fadeAndPop, none
                animationspeed: 300,                       //how fast animtions are
                closeonbackgroundclick: true,              //if you click background will modal close?
                dismissmodalclass: 'close-reveal-modal'    //the class of a button or element that will close an open modal
            });
            break;
        case "invalid_address_modal":
            var content = "<p> The selection <b>'" + data.search + "'</b> is not a valid address.</p>";
            $('#myModal .title').text("Invalid address");
            $('#myModal .subtitle').text("");
            $('#myModal .content').html(content);
            $('#myModal').reveal({
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
    var rescan = setInterval(function() {
        //console.log('rescan');
        bt.scan();
    }, 1000);

    // on deactivate tab clearInterval(rescan);
    //...


    //append the modal window to the body
    var html = '<div id="myModal" class="reveal-modal"><h1 class="title">Modal Title</h1><h2 class="subtitle">Subtitle</h2>'
             + '<div class="content">Any content could go in here.</div><a class="close-reveal-modal">&#215;</a></div>';
    $('body').append(html);


    chrome.runtime.sendMessage({data: 'hello background world!', from: "content"});
});
