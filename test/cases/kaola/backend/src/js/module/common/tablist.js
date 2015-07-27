/**
 * 后台管理 跟单任务列表页
 * Created by hale on 23/06/15.
 */
NEJ.define([
	'base/klass',
	'base/element',
	'base/event',
	'pro/widget/module',
	'pro/widget/form',
	'pro/base/config',
	'pro/base/util',
	'pro/components/common/databox'
], function(_k, _e,_v, _mod, _form, config,_, DataBox, _p, _o, _f, _r,_pro) {
	
	_p._$$MModule = _k._$klass();
	_pro = _p._$$MModule._$extend(_mod._$$MModule);

	_pro.__conf = {};
	_pro.List = '';

	_pro.__init = function(_options, _conf, List) {
		this.__super(_options);
		this.__conf = _conf;
		this.List = List;

		new DataBox(this.__conf.wrapper).$inject(_e._$get('databox'));
	
		var _self = this;
		this.__searchForm = _form._$$WebForm._$allocate({form:'searchForm', onsubmit:function(_data) {
			_.filterNoneData(_data);
			_self.__updateList._$bind(_self)(_data);
		}})

		_v._$addEvent(document.forms.searchForm.elements.tabs, 'change', this.__onTabChange._$bind(this))
	};

	_pro.__onTabChange = function() {

		this.__list.destroy();
		this.__list = null;

		var _data = this.__searchForm._$data();
		_.filterNoneData(_data);
		this.__updateList(_data);
	}

	_pro.__updateList = function(_data) {
		_data.isRelated = _data.isRelated=='0'||_data.isRelated=='false'?false:true;
		if (!this.__list) {
			var _conf = this.__conf.list;
			_conf.data.condition = _data;

			this.__list = new this.List(_conf);
			this.__list.$inject(_e._$get('list'));
		} else {
			this.__list.refresh(_data);
		}
	}

	return _p;
});