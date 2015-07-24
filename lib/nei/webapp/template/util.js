var NEI_API = '{{NEI_MOCK_API}}';
exports.filter = function(id,path){
    var get = function(id,callback){
        var uri = require('util').format(NEI_API,id),
            https = /^https:\/\//i.test(uri);
        require(https?'https':'http').get(
            uri,function(res){
                var ret = [];
                res.on('data',function(chunk){
                    ret.push(chunk.toString());
                });
                res.on('end',function(){
                    var json = null;
                    try{
                        json = JSON.parse(ret.join(''));
                    }catch(ex){
                        // ignore
                    }
                    callback(json);
                });
            }
        ).on(
            'error',function(error){
                callback(null);
            }
        );
    };
    return function(req,res,next){
        var filter = null;
        try{
            filter = require('./filter/'+path+'.js');
        }catch(ex){
            // ignore
        }
        if (!!filter&&(typeof filter)!=='function'){
            res.send(filter);
            return;
        }
        get(id,function(json){
            if (json==null){
                try{
                    json = require('./data/'+path+'.json');
                }catch(ex){
                    // ignore
                }
            }
            if (!!filter){
                json = filter(json);
            }
            res.send(json);
        });
    };
};
