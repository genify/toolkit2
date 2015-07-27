define(["{lib}base/global.js","{lib}util/chain/NodeList.js"],function(_g,_jq){
    var _ap=NEJ.P("wj.ajaxpaging");
    var templeteParser=function(tpl,data){
        var tpl = tpl || '';
        return tpl.replace(/{(([A-Z]|[_]|[0-9])+)}/g,function($1,$2){//大写字母,数字,下划线
            return (data[$2]==null) ? $1 : data[$2];
        });
    };
    var htmlTmpl = {
            pageInfo : '第<b>{CURRENTPAGE}</b>页 共<b>{TOTALPAGE}</b>页 / 共<b>{MAXRECORDNUM}</b>条&#12288;',
            prevPage : '<a href="#prev">上一页</a> ',
            itemPage : '<a href="#{PAGE}">{PAGE}</a> ',
            itemActive : '<span>{PAGE}</span> ',
            pageSplit : '<em>...</em> ',
            nextPage : '<a href="#next">下一页</a>'/*,
             jumpInfo : '&nbsp;到第<input type="text" class="jumpToPageNum"/>页<a href="#go" class="btn_go">确定</a>'*/
        },
    /*
     * 构造一个连续的item链接组
     */
        getLinkRange = function( startPage, endPage, currentPage ){
            var arr = [], i= startPage, j=0;
            for(; i<=endPage; i++)
                arr[j++] = templeteParser(htmlTmpl[i==currentPage ? "itemActive" : "itemPage"],{
                    "PAGE":i
                });
            return arr.join("");
        },
    /*
     * 构造HTML
     *	1 2 3 4 5 6 7 8 ... n	 情况一
     *	1 ... 3 4 5 * 7 8 9 ... n	 情况二
     *	1 ... 10 11 12 * 14 15 16 ... 18	 情况二
     *	1 ... 11 12 13 14 15 16 17 18	情况三
     */
        MakeHTML = function(maxRecordNum, totalPage, currentPage, nearPageNum){ 
            var html = [htmlTmpl.pageInfo + ( currentPage > 1 ? htmlTmpl.prevPage : "" )],
                endMaxLen = nearPageNum * 2 + 2;
            // 页少，直接无省略显示
            if( totalPage <= endMaxLen + 1 )
                html[1] = getLinkRange(1, totalPage, currentPage);
            // 情况一
            else if( currentPage < nearPageNum + 3 ){
                
                html[1] = getLinkRange(1, endMaxLen, currentPage);
                html[2] = htmlTmpl.pageSplit;
                html[3] = getLinkRange(totalPage, totalPage, currentPage);
            }
            //情况三
            else if( currentPage > totalPage - nearPageNum - 2 ){
                html[1] = getLinkRange(1, 1, currentPage);
                html[2] = htmlTmpl.pageSplit;
                html[3] = getLinkRange(totalPage - endMaxLen + 1, totalPage, currentPage);
            }
            //情况二
            else{
                html[1] = getLinkRange(1, 1, currentPage);
                html[2] = htmlTmpl.pageSplit;
                html[3] = getLinkRange(currentPage - nearPageNum, currentPage + nearPageNum, currentPage);
                html[4] = htmlTmpl.pageSplit;
                html[5] = getLinkRange(totalPage, totalPage, currentPage);
            }
            //继续构建html
            html.push( currentPage < totalPage ? htmlTmpl.nextPage : "" );
            //html.push( htmlTmpl.jumpInfo );
            //替换占位符内容
            return templeteParser(html.join(""), {
                "MAXRECORDNUM" : maxRecordNum,
                "CURRENTPAGE" : currentPage,
                "TOTALPAGE": totalPage
            });
        };
    /*
     * 对外扩展接口
     */
    _ap.paging = function( wrap, maxRecordNum, pageSize, currentPage, nearPage, callback ){
        var nearPageNum = nearPage || 3,
            totalPage = parseInt(maxRecordNum/pageSize)+(maxRecordNum%pageSize?1:0),
        //插入Dom节点
            box =_jq(wrap)._$html(MakeHTML(maxRecordNum, totalPage, currentPage, nearPageNum)),
        //重新定位
            reload = function( page ){
                if( callback(page) === false )
                    return;
                //修改html
                currentPage = page;
                box._$html(MakeHTML(maxRecordNum, totalPage, currentPage, nearPageNum));
            };
        //检查是否为初始化
        if( !box[0].initPaging ){
            box[0].initPaging = true;
            box._$on("click","a",function(e){
                var type = this.hash.substr(1);
                switch(type){
                    case "go"://快速跳转
                        var numInput = $(".jumpToPageNum", wrap), num = numInput.val().trim(), page;
                        if( /^\d+$/.test(num) ){
                            page = parseInt(num,10);
                            if( page != currentPage && page <= totalPage )
                                reload(page);
                        }
                        numInput.select();
                        break;
                    case "prev": //上一页
                        reload(currentPage-1);
                        break;
                    case "next": //下一页
                        reload(currentPage+1);
                        break;
                    default: //按照页码跳转
                        if( /^\d+$/.test(type) )
                            reload(+type);
                }
                e.preventDefault();
            });
        }
    };
});