"use strict";

var app = angular.module('sciwApp', [
    'ngTouch'
]);

app.run(['$rootScope', '$http', function($rootScope, $http)
{
    var $s = $rootScope,
        apiLink = 'https://min-api.cryptocompare.com/data/pricemulti';

    angular.extend($s, {

        items: {
            'DOGE': {
                trades: [
                    {
                        amount: 12000,
                        price: 0.0012,
                        currency: 'EUR'
                    }
                ]
            }
        }

    });


/*

    $http.get(apiLink, {params: {fsyms: 'ETH,DASH,DOGE', tsyms: 'BTC,USD,EUR'}}).then(
        function(response) {
            console.log(response.data);
            angular.forEach(response.data, function(data, code) {
                if (angular.isDefined($s.items[code])) {
                    $s.items[code].$$currentPrice = data;
                }
            });
            console.log(response.data);
        }
    )

*/

//    function add

}]);


app.filter('lowercase', function()
{
    return function(input) {
        if (angular.isString(input)) {
            return input.toLowerCase();
        } else {
            return '';
        }
    }
});