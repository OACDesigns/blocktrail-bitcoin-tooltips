
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

    var btcRegex = /^[13][a-km-zA-HJ-NP-Z0-9]{25,34}$/;
    var tBtcRegex = /^[2mn][a-km-zA-HJ-NP-Z0-9]{25,34}$/;

    $('a').each(function(key, val){
        //try match bitcoin address
        var matches = $(this).text().match(btcRegex);
        if(matches != null) {
            $(this).addClass('blocktrail-tooltip');
            $(this).attr('data-network', 'btc').attr('data-address', matches[0]);
            //setupTooltip($(this));
            //getAddressInfo(matches[0], 'btc', $(this));
        } else {
            //try match testnet address
            matches = $(this).text().match(tBtcRegex);
            if(matches != null) {
                $(this).addClass('blocktrail-tooltip');
                $(this).attr('data-network', 'tbtc').attr('data-address', matches[0]);
                //setupTooltip($(this));
                //getAddressInfo(matches[0], 'tbtc', $(this));
            }
        }
    });

    $('body').on('mouseenter', '.blocktrail-tooltip', function(){
        var address = $(this).attr('data-address');
        var network = $(this).attr('data-network');
        //getAddressInfo(address, network, $(this));
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
                    },
                    function error(xhr, status, error){
                        console.log('Oh noes, an error!', error);
                        api.set('content.text', status + ': ' + error);
                });
            }
        }
    });
});