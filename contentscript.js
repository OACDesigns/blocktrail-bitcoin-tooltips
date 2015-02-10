
var apiUrl = "https://api.blocktrail.com/";
var apiVersion = "v1";
var api_key = "MY_APIKEY";
var api_secret = "MY_APISECRET";

function setupTooltip(element) {
    //prepare the tooltip for the given element
    var tooltipHTML = '<span class="tooltip">loading...</span>';
    //$(element).addClass('tooltip-wrapper');
    $(element).append(tooltipHTML);
}

function getAddressInfo(address, network, element) {
    //get bitcoin address info and then creates a tooltip on the given element
    $.ajax({
        url: apiUrl + apiVersion + "/" + network + "/address/" + address,
        data: {api_key: api_key},
        type: "GET",
        cache: false,
        success: function(data){
            console.log('got some data!', data);

            $('.tooltip', $(element)).html('<small>' + data.address + '</small><br>' + 'balance: ' + data.balance);

            $(element).hover(function(){
                console.log('address: ' + address);
            });

        },
        error: function(data){
            console.log('Oh noes, an error!', data);
        },
        dataType: 'json'
    });

}

$(document).ready(function(){
    console.log('Blocktrail browser extension...ready!');

    //match where space, string start/end or non-word character precedes and follows the address (split into a group for separation from the address itself)
    var btcRegex = /([\s|\W]+|^)([13][a-km-zA-HJ-NP-Z0-9]{25,34})([\s|\W]+|$)/g;
    var tBtcRegex = /([\s|\W]+|^)([2mn][a-km-zA-HJ-NP-Z0-9]{25,34})([\s|\W]+|$)/g;

    $('a').each(function(key, val){
        //try match bitcoin address in both href and anchor text
        var searchText = $(this).text() + " " + $(this).attr('href');
        var matches = btcRegex.exec(searchText);
        //console.log(matches);
        if(matches != null) {
            $(this).addClass('blocktrail-tooltip');
            $(this).attr('data-network', 'btc').attr('data-address', matches[2]);   //get the second group of the match
            //setupTooltip($(this));
            //getAddressInfo(matches[0], 'btc', $(this));

            //need to reset the indexes of each regex as we are using the global modifier
            btcRegex.lastIndex = 0;
        } else {
            //try match testnet address
            matches = tBtcRegex.exec(searchText);
            //console.log(matches);
            if(matches != null) {
                $(this).addClass('blocktrail-tooltip');
                $(this).attr('data-network', 'tbtc').attr('data-address', matches[2]);
                //setupTooltip($(this));
                //getAddressInfo(matches[0], 'tbtc', $(this));

                //need to reset the indexes of each regex as we are using the global modifier
                tBtcRegex.lastIndex = 0;
            }
        }
    });

    $('body').on('mouseenter', '.blocktrail-tooltip', function(){
        var address = $(this).attr('data-address');
        var network = $(this).attr('data-network');
        //getAddressInfo(address, network, $(this));
    });

    //if the dom is modified we need to re-parse
    //...
    $("body").bind("DOMSubtreeModified", function() {
        console.log("tree changed");
    });

    $('.blocktrail-tooltip').qtip({
        content: {
            text: function(event, api) {
                //get the info about the address
                var address = $(this).data('address');
                var network = $(this).data('network');

                return $.ajax({
                        url: apiUrl + apiVersion + "/" + network + "/address/" + address,
                        data: {api_key: api_key},
                        type: "GET",
                        cache: false,
                        dataType: 'json'
                    }).then(
                    function success(data){
                        console.log('got some data!', data);
                        return '<small>' + data.address + '</small><br>' + 'balance: ' + data.balance;
                        //api.set('content.text', content);
                    },
                    function error(xhr, status, error){
                        console.log('Oh noes, an error!', error);
                        api.set('content.text', status + ': ' + error);
                });
            }
        }
    });
});