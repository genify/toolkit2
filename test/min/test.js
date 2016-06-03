var should = require('should'),
    util = require('util');

describe('nej export',function(){
    it('should be ok for nej export js list',function(done){
        this.timeout(5000);
        var root = './test/export/test/'
        var cmd = util.format(
            'node %s export %s -o %s --codeWrap <script>%s</script>',
            './bin/nej.js',
            './delegate.js',
            root+'min.html'
        );
        console.log(cmd)
        require('child_process').exec(
            cmd,function(error, stdout, stderr){
                console.log(stdout);
            }
        );
    });
});


