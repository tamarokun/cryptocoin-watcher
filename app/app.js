"use strict";

var app = angular.module('sciwApp', [
    'ngTouch'
]);

app.run(['$rootScope', '$http', function($rootScope, $http)
{
    var $s = $rootScope,
        apiLink = 'https://min-api.cryptocompare.com/data/pricemulti',
        cryptoCodes = ['BTC', 'EUR', 'USD', 'ETH', 'DOGE', 'DASH'];


    angular.extend($s, {

        exchangeRates: {},
        displayCodes: ['BTC', 'EUR', 'USD'],
        finalCurrency: 'BTC',
        finalCurrencyPrecision: 5,

        items: {
            'DOGE': {
                trades: [
                    {
                        amount: 12000,
                        price: 0.0012,
                        currency: 'EUR',
                        exchange: 'Kraken'
                    },

                    {
                        amount: 10000,
                        price: 0.0029,
                        currency: 'USD',
                        exchange: 'Poloniex'
                    }

                ]
            }
        }

    });



    $http.get(apiLink, {params: {fsyms: cryptoCodes.join(','), tsyms: cryptoCodes.join(',')}}).then(
        function(response) {
            $s.exchangeRates = response.data;

            angular.forEach(response.data, function(data, code) {

                if (angular.isDefined($s.items[code])) {
                    $s.items[code].$$currentPrice = data;

                    angular.forEach($s.items[code].trades, function(tradeData)
                    {
                        tradeData.$$tradeValue = {
                            current: {},
                            old: {}
                        };

                        angular.forEach(data, function(price, currency) {
                            // FIXME verify existence of desired final currency in exchange list
                            tradeData.$$tradeValue.old[currency] = tradeData.amount * tradeData.price * $s.exchangeRates[tradeData.currency][$s.finalCurrency];
                            tradeData.$$tradeValue.current[currency] = tradeData.amount * price;
                        });
                    });

                }
            });
            console.log(response.data);
        }
    )


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