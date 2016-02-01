var b = 'bbbbbb';
(function(){

    var pro = (function(){}).prototype;

    pro._api = function(x){
        console.log(x);
    };

    pro['_api2'] = function(y){
        console.log(y);
    };

})();