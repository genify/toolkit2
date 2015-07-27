NEJ.define('{pro}module/page.js',['pro/widget/module','{lib}util/list/module.pager.js', '{lib}ui/layer/window.js', '{lib}util/ajax/dwr.js'],
function(){
 	var _p = NEJ.P('loft.page'),
 		_pro,
 		_proItme;
 	
 	_p._$$Page = NEJ.C();
 	_pro = _p._$$Page._$extend(loft.w._$$MModule);
 	
 	_pro.__init = function() {
 		this.__super();
 		
 		this.__hkey = 'id';
 		this.__ckey = 'following_0';
 		
 		//test dwr
 		nej.j._$requestByDWR('ProductBean.index',{
			path:'/dwr/call/plaincall/',
		    script:false,
		    param:[],
		    onload:function(_list){
		    	debugger;
//		    	_options.onload(_list);
		    }
		});
// 		this.__initPage();
// 		this.__count.innerText = this.__config.count||0;
// 		this.__listModule = nej.ut._$$ListModulePG._$allocate({
// 			limit: 20,
// 			parent: this.__box,
// 			pager: {parent:this.__pager},
// 			item: {klass: _p._$$UserItem},
// 			cache: {
// 				key: 'following',
// 				lkey: 'following',
// 				total: this.__config.count,
// 				klass: loft.d._$$CacheFollowing
// 			},
// 			onbeforelistload: this.__beforeListLoad._$bind(this)
// 		});
 		
 		var _clicktest = document.getElementById('layertest');
// 		var _window = nej.ui._$$Window._$allocate({
//            parent:document.body,
//            title:'弹出框标题',
//            align:'middle middle',
//            draggable:true,
//            onclose:function(){
//            }
//        });
// 		nej.v._$addEvent(_clicktest, 'click', function(){_window._$show();}._$bind(this));
 		
 		nej.v._$addEvent(_clicktest, 'click', function(){
 			var _window = nej.ui._$$Window._$allocate({
 	            parent:document.body,
 	            title:'弹出框标题',
 	            align:'middle middle',
 	            draggable:true,
 	            onok:function(){
 	            	alert('确定');
 	            },
 	            oncc:function(){
 	            	alert('取消');
 	            }
 	        });
 			_window._$show();
 		}._$bind(this))
 	};
 	
 	_pro.__beforeListLoad = function(_node, _obj) {
 		debugger;
 		_node.stopped = true;
 	};
 	
 	_pro.__initPage = function(){
 		var _ntmp = nej.e._$getByClassName(document.body, 'ztag'),i=0;
 		this.__tab0 = _ntmp[i++];
 		this.__tab1 = _ntmp[i++];
 		this.__box = _ntmp[i++];
 		this.__pager = _ntmp[i++];
 		this.__suggestSearch = _ntmp[i++];
 		this.__suggestTip = _ntmp[i++];
 		this.__count = nej.e._$get('gblogcount');

 		this.__sidecount = nej.e._$get('gsdfollowingcount');
 		this.__searchBox = nej.e._$get('searchbox');
 		this.__radarBox = nej.e._$get('radarbox');
 	};
 	
 	/**
 	 * 刷新列表模块，当数据源切换的时候
 	 * */
 	_pro.__refresh = function(_cache) {
 		if(!!this.__listModule) this.__listModule._$destroy();
 		this.__onLoading();
 		this.__listModule = new (loft.w._$$ListModule)(this.__iclass, _cache, this.__lopt);
 	};

 	_pro._$onListEmpty = function(){
 		this.__box.innerHTML = '<div class="m-end m-end-2"><h2>无搜索结果</h2></div>';
 	};

 	_pro.__onLoading = function(){
 		this.__box.style.backgroundColor = 'white';
 		this.__box.innerHTML = '<div class="w-load2"><div class="load">加载中</div></div>';
 	};

 	_pro.__onAfterChange = function(){
 		this.__box.style.backgroundColor = 'transparent';
 	};
 	_pro.__unFollow = function(_blogId){
 		this.__cache._$unfollow(_blogId);
 	};

 	_pro.__cbUnfollow = function(_blogId, _code){
 		if(!!_code && _code > 0) {//取消关注成功
 			E._$showHint('取消关注成功', true);
 			if (this.__ckey == 'following_0') {
 				this.__cache._$clearCache('following_1');
 			}
 			if (this.__ckey == 'following_1') {
 				this.__cache._$clearCache('following_0');
 			}
 			var _items = this.__listModule._$getItems(),l=_items.length,i=0,_index;
 			_index = U._$indexOf(_items, function(_item) {
 				return _item._$getData().blogId == _blogId;
 			});
 			_index != -1 && _items[_index]._$refreshFollowState(false, true);
 			var _length = (--this.__config.count);
 			if(!this.__search)
 				this.__count.innerText = _length;
 			if(!!this.__sidecount) this.__sidecount.innerText = _length;
 			
// 			if(!!loft.g.dousercard){
// 				loft.g.dousercard(null,null,null,{doDelFunc:true, flag:_blogId, changeFollow:true, followStatus:false});
// 			}
 		}
 	};

 	_pro.__onFollow = function(_blogId) {
 		this.__cache._$onFollow(_blogId);
 	};

 	_pro.__cbFollow = function(_code) {
 		if(!!_code && _code > 0) {//关注成功
 			E._$showHint('关注成功', true);
 			if (this.__ckey == 'following_0') {
 				this.__cache._$clearCache('following_1');
 			}
 			if (this.__ckey == 'following_1') {
 				this.__cache._$clearCache('following_0');
 			}
 			var _items = this.__listModule._$getItems(),l=_items.length,i=0,_index;
 			_index = U._$indexOf(_items, function(_item) {
 				return _item._$getData().blogId == _code;
 			});
 			_index!=-1 && _items[_index]._$refreshFollowState(true, true);
 			var _length = (++this.__config.count);
 			if(!this.__search)
 				this.__count.innerText = _length;
 			if(!!this.__sidecount) this.__sidecount.innerText = _length;
 			
 			if(!!loft.g.dousercard){
 				loft.g.dousercard(null,null,null,{doDelFunc:true, flag:_code, changeFollow:true, followStatus:true});
 			}
 		} else {
 			loft.x._$showErrorFollowMsg(_code);
 		}
 	};

 	/**
 	 * 搜索昵称时获取总数
 	 * */
 	_pro.__cbLoadTotal = function(_items) {
 		var _total = this.__scache._$getTotalInCache();
 		this.__count.innerText = (parseInt(_total)||0);
 	};
 	
 	/**
 	 * 关注用户Item
 	 * */
 	_p._$$UserItem = NEJ.C();
 	_proPItem = _p._$$UserItem._$extend(nej.ui._$$ListItem);
 	
 	_proPItem.__init = function(_options){
 		this.__super();
 		var _ntmp = nej.e._$getByClassName(this.__body,'xtag'),i=0;
 		this.__img = _ntmp[i++];//头像
 		this.__nickname = _ntmp[i++];//博客昵称
 		this.__selfIntro = _ntmp[i++];
 		this.__unFollowBt = _ntmp[i++];
 		nej.v._$addEvent(this.__unFollowBt, 'click', this.__unfollow._$bind(this));
// 		V._$addEvent(this.__body, 'mouseover', this.__onUCMouseAction._$bind(this, true, this.__body));
// 		V._$addEvent(this.__body, 'mouseout', this.__onUCMouseAction._$bind(this, false, this.__body));
 		
// 		this.__onCbFollow = this.__cbFollowSucc._$bind(this);
// 		this.__onCbUnFollow = this.__cbUnFollowSucc._$bind(this);
 	};
 	
 	_proPItem.__initNodeTemplate = function() {
 		this.__seed_html = nej.e._$addNodeTemplate('<li>\
             	<div class="w-img2 w-img2-1"><a href="#" target="_blank"><img class="xtag"></a></div>\
                 <div class="cnt">\
                 	<h4><em><a href="#" class="xtag" target="_blank">某某某</a></em></h4>\
                     <p class="xtag">一天前更新</p>\
                 </div>\
                 <a href="#" class="xtag w-gz w-gz-0" title="取消关注">取消关注</a>\
             </li>');
 	};
 	
 	_proPItem.__doRefresh = function(_data) {
 		var _data = this.__data;
 		if(_data.blogId <= 0) return;
 		
 		var _info = this.__blogInfo = _data.blogInfo||_data;
 		this.__nickname.innerText = _info.blogNickName||'';
 		this.__img.src = (_info.bigAvaImg);
 		this.__img.parentNode.href = this.__nickname.href = (_info.blogName||'');
// 		var _dateStr = loft.x._$datetime(_info.postAddTime) || '从未';
// 		this.__selfIntro.innerText = !_data.isunfollow ?  _dateStr + '更新' : (_info.selfIntro.replace(/\n/g,' ')||'');
 		this.__blogId = _info.blogId;
 		this._$refreshFollowState();
// 		E._$hoverElement(this.__body, 'j-hov');
 	};
 	
 	_proPItem.__unfollow = function(_event){
 		V._$stop(_event);
// 		this._$dispatchEvent(!!this.__data.isunfollow ? 'onfollow' : 'unfollow', this.__blogId);
 	};
 	
 	/**
 	 * 刷新关注状态
 	 * @param _isfollow 当前关注状态
 	 * @param _update   是否更新缓存数据
 	 * @return {void}
 	 * */
 	_proPItem._$refreshFollowState = function(_isfollow, _update){
// 		if(this.__blogInfo.blogId === loft.c._$$VISITOR.userId) {
// 			this.__unFollowBt.style.display = 'none';return;
// 		}else {
// 			this.__unFollowBt.style.display = '';
// 			this.__unFollowBt.parentNode.style.display = '';
// 		}
 		if(!!_update) this.__data.isunfollow = !_isfollow;
 		if(!!this.__data.isunfollow) {//未关注状态
 			if(this.__unFollowBt.innerHTML == '取消关注') {
 				nej.e._$replaceClassName(this.__unFollowBt, 'w-gz-0', 'w-gz-1');
 				this.__unFollowBt.innerHTML = this.__unFollowBt.title = '添加关注';
 			}
 		}else {//已关注状态
 			if(this.__unFollowBt.innerHTML == '添加关注') {
 				nej.e._$replaceClassName(this.__unFollowBt, 'w-gz-1', 'w-gz-0');
 				this.__unFollowBt.innerHTML = this.__unFollowBt.title = '取消关注';
 			}
 		}
 	};
 	
 	new _p._$$Page();
});