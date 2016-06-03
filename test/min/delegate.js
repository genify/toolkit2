(function(){
    if (!window.localStorage||
        !window.postMessage){
        return;
    }
    var appkey;
    var cmap = {
        key:function(value){
            appkey = value||'';
        },
        usr:function(value){
            if (!appkey){
                return;
            }
            var key = 'X-'+appkey.toUpperCase()+'-YSF-INFO';
            localStorage.setItem(key,value);
        }
    };
    var sendMsg = function(msg){
        parent.postMessage(msg,'*');
    };
    var receiveMsg = function(event){
        var arr = (event.data||'').split(':'),
            func = cmap[(arr.shift()||'').toLowerCase()];
        if (!!func){
            func(arr.join(':'));
        }
    };
    if (!!window.addEventListener){
        window.addEventListener('message',receiveMsg,!1);
    }else{
        window.attachEvent('onmessage',receiveMsg);
    }
    var checkACK = function(){
        if (!appkey){
            return;
        }
        var key = 'X-'+appkey.toUpperCase()+'-YSF-ACK',
            time = localStorage.getItem(key);
        sendMsg('ACK:'+time);
    };
    // init delegate
    sendMsg('RDY:'+(+new Date));
    window.setInterval(checkACK,2000);
    checkACK();
})();
