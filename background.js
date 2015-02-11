// Called when the user clicks on the browser action.
/*
chrome.browserAction.onClicked.addListener(function(tab) {
    var action_url = "javascript:window.print();";
    chrome.tabs.update(tab.id, {url: action_url});
});
*/








var btcRegex = /([\s|\W]+|^)([13][a-km-zA-HJ-NP-Z0-9]{25,34})([\s|\W]+|$)/g;
var tBtcRegex = /([\s|\W]+|^)([2mn][a-km-zA-HJ-NP-Z0-9]{25,34})([\s|\W]+|$)/g;
var txHashRegex = /([\s|\W]+|^)([0-9a-f]{64})([\s|\W]+|$)/g;

var blocktrailUrl = "https://www.blocktrail.com/";
blocktrailUrl = "http://blocktrail.localhost/";


/**
 * checks the given string for a btc/tbtc address and returns both network and found address
 *
 * @param input
 * @returns {{network: string, address: null}}
 */
function matchBitcoinAddress(input) {
    //check the input for a bitcoin/testnet address and return object of results

    var result = {
        network: 'btc',
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
            result.network = "tbtc";
            result.address = matches[2];
        }
    }

    return result;
}


/**
 * our context menu click handler
 * @param info
 * @param tab
 */
function contextMenuHandler(info, tab) {
    if (info.menuItemId == "contextLink") {
        //check the link for an address to go to
        var result = matchBitcoinAddress(info.linkUrl);
        chrome.tabs.update(tab.id, {url: blocktrailUrl+result.network+"/address/"+result.address});
    } else if (info.menuItemId == "contextSelection") {
        //check the text selection for an address to go to
        var result = matchBitcoinAddress(info.selectionText);
        chrome.tabs.update(tab.id, {url: blocktrailUrl+result.network+"/address/"+result.address});
    }
    console.log(info, tab);
}



// Create context menus for different context type.
var contextMenus = {};
//root menu
contextMenus.root = chrome.contextMenus.create({
    "id": 'root',
    "title": "Blocktrail",
    "contexts":["all"]
});
//Text selection
contextMenus.selectionMenu = chrome.contextMenus.create({
    "id": 'contextSelection',
    "parentId": contextMenus.root,
    "title": "Search Blocktrail for '%s'",
    "contexts":["selection"],
    "onclick": contextMenuHandler
});
//links
contextMenus.linkMenu = chrome.contextMenus.create({
    "id": 'contextLink',
    "parentId": contextMenus.root,
    "title": "Search Blocktrail for address",
    "contexts":["link"],
    "onclick": contextMenuHandler
});
//separator
contextMenus.linkMenu = chrome.contextMenus.create({
    "parentId": contextMenus.root,
    "type": 'separator',
    "contexts":["all"]
});
//generic menu option
contextMenus.selectionMenu = chrome.contextMenus.create({
    "id": 'toBlocktrail',
    "parentId": contextMenus.root,
    "title": "Go to Blocktrail.com",
    "contexts":["all"],
    "onclick": function(info, tab){
        chrome.tabs.update(tab.id, {url: "https://www.blocktrail.com"});
    }
});