"use strict";

var app = angular.module('sciwApp', [
    'ngTouch'
]);

app.run(['$rootScope', '$http', function($rootScope, $http)
{
    var $s = $rootScope,
        apiLink = 'https://min-api.cryptocompare.com/data/pricemulti',
        cryptoCodes = ['BTC', 'EUR', 'USD', 'ETH', 'DOGE', 'DASH', 'EOS', 'IOT', 'SAN'];


    angular.extend($s, {

        changeCurrency: changeCurrency,


        exchangeRates: {},
        displayCodes: ['BTC', 'EUR', 'USD'],
        finalCurrency: 'EUR',
        finalCurrencyPrecision: 1,

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
            },

            'EOS': {
                trades: [
                    {
                        amount: 8.18,
                        price: 2.78,
                        currency: 'USD',
                        exchange: 'Bitfinex'
                    }
                ]
            },

            'SAN': {
                trades: [
                    {
                        amount: 135,
                        price: 0.18499,
                        currency: 'USD',
                        exchange: 'Bitfinex'
                    }
                ]
            },

            'IOT': {
                trades: [
                    {
                        amount: 30.26448377,
                        price: 0.00017345,
                        currency: 'BTC',
                        exchange: 'Bitfinex'
                    },

                    {
                        amount: 186.73215195,
                        price: 0.000098,
                        currency: 'BTC',
                        exchange: 'Bitfinex'
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
                            tradeData.$$tradeValue.old[currency] = tradeData.amount * tradeData.price * $s.exchangeRates[tradeData.currency][currency];
                            tradeData.$$tradeValue.current[currency] = tradeData.amount * price;
                        });
                    });

                }
            });
            console.log(response.data);
        }
    )


//    function add


    function changeCurrency(currency, e)
    {
        $s.finalCurrency = currency;
        switch (currency) {
            case 'BTC':
                $s.finalCurrencyPrecision = 5;
                break;
            default:
                $s.finalCurrencyPrecision = 1;
        }
        e.preventDefault();
    }

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