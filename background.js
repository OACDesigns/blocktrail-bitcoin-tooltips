
var btcRegex = /([\s|\W]+|^)([13][a-km-zA-HJ-NP-Z0-9]{25,34})([\s|\W]+|$)/g;
var tBtcRegex = /([\s|\W]+|^)([2mn][a-km-zA-HJ-NP-Z0-9]{25,34})([\s|\W]+|$)/g;
var txHashRegex = /([\s|\W]+|^)([0-9a-f]{64})([\s|\W]+|$)/g;

var blocktrailUrl = "https://www.blocktrail.com/";


/**
 * checks the given string for a btc/tbtc address and returns both network and found address
 *
 * @param input
 * @returns {{network: string, address: null}}
 */
function matchBitcoinAddress(input) {
    //check the input for a bitcoin/testnet address and return object of results

    var result = {
        network: 'BTC',
        address: null
    };

    //first try match bitcoin address
    var matches = btcRegex.exec(input);
    if(matches != null) {
        result.address = matches[2];   //get the second group of the match
    } else {
        //try match testnet address
        matches = tBtcRegex.exec(input);

        if(matches != null) {
            result.network = "tBTC";
            result.address = matches[2];
        }
    }

    return result;
}

/**
 * searches the given text for a btc/tbtc address and then opens a tab with that address on blocktrail.com
 * @param searchText
 */
function findOnBlocktrail(searchText) {
    //check the given text for an address and open it on blocktrail in a new tab
    var result = matchBitcoinAddress(searchText);
    newUrl = blocktrailUrl+result.network+"/address/"+result.address;
    chrome.tabs.create({ url: newUrl })
}

/**
 * searches the text for an address and opens a popup with a QR code for making payments
 * @param searchText
 */
function payBitcoinAddressPopup(searchText) {
    var result = matchBitcoinAddress(searchText);
    if (result.address) {

    } else {
        //no valid address found
    }
}


/**
 * our context menu click handler
 * @param info
 * @param tab
 */
function contextMenuHandler(info, tab) {
    //handle the event appropriately for the selected context menu
    var newUrl = blocktrailUrl;

    switch(info.menuItemId) {
        case "link_search_address":
            findOnBlocktrail(info.linkUrl);
            break;
        case "selection_search_address":
            findOnBlocktrail(info.selectionText);
            break;
        case "link_pay_address":
            payBitcoinAddressPopup(info.linkUrl);
            break;
        case "selection_pay_address":
            payBitcoinAddressPopup(info.selectionText);
            break;
        case "go_to_blocktrail":
            //chrome.tabs.update(tab.id, {url: "https://www.blocktrail.com"});      //redirect current tab
            chrome.tabs.create({url: blocktrailUrl});        //navigate in new ta
            break;
        case "testing":
            //send a message through the shared DOM
            console.log('sending message');
            chrome.tabs.sendMessage(tab.id, "Hello world, I love lamp! - background");
            break;
        default:
            //unhandled event
            console.log("unhandled event...", info, tab);
    }
}



// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
    // Create context menus for different context type.
    var contextMenus = {};
    //root menu
    contextMenus.root = chrome.contextMenus.create({
        "id": 'root',
        "title": "Blocktrail",
        "contexts": ["all"]
    });

    /*---Text selections---*/
    //see address on blocktrail
    contextMenus.selectionMenu = chrome.contextMenus.create({
        "id": 'selection_search_address',
        "parentId": contextMenus.root,
        "title": "Search Blocktrail for '%s'",
        "contexts": ["selection"]
    });
    //pay address
    contextMenus.selectionMenu = chrome.contextMenus.create({
        "id": 'selection_pay_address',
        "parentId": contextMenus.root,
        "title": "Send Bitcoin to '%s'",
        "contexts": ["selection"]
    });

    /*---Links---*/
    //see address on blocktrail
    contextMenus.linkMenu = chrome.contextMenus.create({
        "id": 'link_search_address',
        "parentId": contextMenus.root,
        "title": "Search Blocktrail for address",
        "contexts": ["link"]
    });
    //pay address
    contextMenus.linkMenu = chrome.contextMenus.create({
        "id": 'link_pay_address',
        "parentId": contextMenus.root,
        "title": "Send Bitcoin to Address",
        "contexts": ["link"]
    });


    //separator
    contextMenus.linkMenu = chrome.contextMenus.create({
        "parentId": contextMenus.root,
        "type": 'separator',
        "contexts": ["all"]
    });


    /*---generic menu option---*/
    //visit blocktrail.com
    contextMenus.selectionMenu = chrome.contextMenus.create({
        "id": 'go_to_blocktrail',
        "parentId": contextMenus.root,
        "title": "Go to Blocktrail.com",
        "contexts": ["all"]
    });

    //testing menu option
    contextMenus.selectionMenu = chrome.contextMenus.create({
        "id": 'testing',
        "parentId": contextMenus.root,
        "title": "Testing",
        "contexts": ["all"]
    });
});



/*----Register Event Handlers----*/

//message handler
chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
    console.log("background got a message", data);
});

//add a general event listener whenever this event page is loaded
chrome.contextMenus.onClicked.addListener(contextMenuHandler);

// Called when the user clicks on the browser action.
/*
 chrome.browserAction.onClicked.addListener(function(tab) {
 var action_url = "javascript:window.print();";
 chrome.tabs.update(tab.id, {url: action_url});
 });
 */
