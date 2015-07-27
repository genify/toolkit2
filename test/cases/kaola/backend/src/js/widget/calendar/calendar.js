NEJ.define(['{lib}util/event.js'],
function(){
	var _p = NEJ.P('haitao.bw'),
		_pro;
	
	_p._$$Calendar = NEJ.C();
	_pro = _p._$$Calendar._$extend(nej.ut._$$Event);
	
	_pro.__init = function() {
		this.__super();
		
		this.__controlid = this.__currdate = this.__startdate = this.enddate = null;
		this.__yy = this.__mm = this.__hh = this.__ii = null;
		this.__currday = null;
		this.__addtime = false;
		this.__today = new Date();
		this.__lastcheckedyear = this.__lastcheckedmonth = false;
		
		this.__initCalendar();
		var g = NEJ.P('haitao.g');
		g.zeroFill = this.__zeroFill._$bind(this);
		g.showDiv = this.__showDiv._$bind(this);
		g.refreshCalendar = this.__refreshCalendar._$bind(this);
		g.settime = this.__settime._$bind(this);
		g.showCalendar = this._$showCalendar._$bind(this);
		g.stop = nej.v._$stop;
	};
	
	_pro.__reset = function(_options) {
		this.__super(_options);
	};
	
	_pro.__initCalendar = function() {
		var s = ''; 
		s += '<div class="w-calendarwidget" id="calendar" style="display:none; position:absolute; z-index:9;" onclick="haitao.g.stop(event)">'; 
		s += '<div style="width: 200px;"><table class="tableborder" cellspacing="0" cellpadding="0" width="100%" style="text-align: center">'; 
		s += '<tr align="center" class="header"><td class="header"><a href="#" onclick="haitao.g.refreshCalendar(null, -1, 1);return false" title="上一月"><<</a></td><td colspan="5" style="text-align: center" class="header"><a href="#" onclick="haitao.g.showDiv(\'year\');haitao.g.stop(event);return false" title="点击选择年份" id="year"></a>年<a id="month" title="点击选择月份" href="#" onclick="haitao.g.showDiv(\'month\');haitao.g.stop(event);return false"></a>月</td><td class="header"><A href="#" onclick="haitao.g.refreshCalendar(null, 1, 2);return false" title="下一月">>></A></td></tr>'; 
		s += '<tr class="category"><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr>'; 
		for(var i = 0; i < 6; i++) { 
			s += '<tr class="altbg2">'; 
			for(var j = 1; j <= 7; j++) 
			s += "<td id=d" + (i * 7 + j) + " height=\"19\">0</td>"; 
			s += "</tr>"; 
		} 
		s += '<tr id="hourminute"><td colspan="7" align="center"><input type="text" size="1" value="" id="hour" onBlur=\'this.value=this.value > 23 ? 23 : haitao.g.zeroFill(this.value);\'> 点 <input type="text" size="1" value="" id="minute" onBlur=\'this.value=this.value > 59 ? 59 : haitao.g.zeroFill(this.value);\'> 分</td></tr>'; 
		s += '</table></div></div>';
		s += '<div id="calendar_year" onclick="haitao.g.stop(event)"><div class="col">'; 
		for(var k = 1930; k <= 2049; k++) { 
			s += k != 1930 && k % 10 == 0 ? '</div><div class="col">' : ''; 
			s += '<a href="#" onclick="haitao.g.refreshCalendar(' + k + ', null, 0);document.getElementById(\'calendar_year\').style.display=\'none\';return false"><span' + (this.__today.getFullYear() == k ? ' class="today"' : '') + ' id="calendar_year_' + k + '">' + k + '</span></a><br />'; 
		} 
		s += '</div></div>'; 
		s += '<div id="calendar_month" onclick="haitao.g.stop(event)">'; 
		for(var k = 1; k <= 12; k++) { 
			s += '<a href="#" onclick="haitao.g.refreshCalendar(null, ' + (k - 1) + ');document.getElementById(\'calendar_month\').style.display=\'none\';return false"><span' + (this.__today.getMonth()+1 == k ? ' class="today"' : '') + ' id="calendar_month_' + k + '">' + k + ( k < 10 ? ' ' : '') + ' 月</span></a><br />'; 
		} 
		s += '</div>'; 
		var nElement = document.createElement("div"); 
		nElement.innerHTML=s; 
		document.body.appendChild(nElement); 
		
		this.__calendar = nej.e._$get('calendar');
		this.__calendarYear = nej.e._$get('calendar_year');
		this.__calendarMonth = nej.e._$get('calendar_month');
		this.__year = nej.e._$get('year');
		this.__month = nej.e._$get('month');
		this.__hour = nej.e._$get('hour');
		this.__minute = nej.e._$get('minute');
		this.__hourMinute = nej.e._$get('hourminute');
		
		nej.v._$addEvent(document, 'click', function(_event){
			//nej.v._$stop(_event);
			this.__calendar.style.display = this.__calendarYear.style.display = this.__calendarMonth.style.display = 'none';
		}._$bind(this));
		
		nej.v._$addEvent(this.__calendar, 'click', function(_event) {
			nej.v._$stop(_event);
			this.__calendarYear.style.display = this.__calendarMonth.style.display = 'none';
		}._$bind(this));
	};
	
	_pro.__getPosition = function(_obj) {
		var _r = new Array(); 
		_r['x'] = _obj.offsetLeft; 
		_r['y'] = _obj.offsetTop; 
		while(_obj = _obj.offsetParent) 
		{ 
			_r['x'] += _obj.offsetLeft; 
			_r['y'] += _obj.offsetTop; 
		} 
		return _r; 
	};
	
	_pro.__parseDate = function(_date) {
		/(\d+)\-(\d+)\-(\d+)\s*(\d*):?(\d*)/.exec(_date); 
		var _m1 = (RegExp.$1 && RegExp.$1 > 1899 && RegExp.$1 < 2101) ? parseFloat(RegExp.$1) : this.__today.getFullYear(); 
		var _m2 = (RegExp.$2 && (RegExp.$2 > 0 && RegExp.$2 < 13)) ? parseFloat(RegExp.$2) : this.__today.getMonth() + 1; 
		var _m3 = (RegExp.$3 && (RegExp.$3 > 0 && RegExp.$3 < 32)) ? parseFloat(RegExp.$3) : this.__today.getDate(); 
		var _m4 = (RegExp.$4 && (RegExp.$4 > -1 && RegExp.$4 < 24)) ? parseFloat(RegExp.$4) : 0; 
		var _m5 = (RegExp.$5 && (RegExp.$5 > -1 && RegExp.$5 < 60)) ? parseFloat(RegExp.$5) : 0; 
		/(\d+)\-(\d+)\-(\d+)\s*(\d*):?(\d*)/.exec("0000-00-00 00\:00"); 
		return new Date(_m1, _m2 - 1, _m3, _m4, _m5); 
	};
	
	_pro.__settime = function(_d) {
		this.__calendar.style.display = 'none';
		this.__controlid.value = this.__yy + "-" + this.__zeroFill(this.__mm + 1) + "-" + this.__zeroFill(_d) + (this.__addtime ? ' ' + this.__zeroFill(this.__hour.value) + ':' + this.__zeroFill(this.__minute.value) : '');
		//为 readonly 的input触发change 事件 
		this._$dispatchEvent('aftersettime',this.__controlid);
	};
	
	_pro._$showCalendar = function(_event, _controlid, _addtime, _nochosebeforetime, _startdate, _enddate) {
		this.__controlid = _controlid; 
		this.__addtime = _addtime; 
		this.__nochosebeforetime = _nochosebeforetime;		//是否可以选择先前的时间  true为不能选择
		this.__startdate = _startdate ? this.__parseDate(_startdate) : false; 
		this.__enddate = _enddate ? this.__parseDate(_enddate) : false; 
		this.__currday = this.__controlid.value ? this.__parseDate(this.__controlid.value) : this.__today; 
		this.__hh = this.__currday.getHours(); 
		this.__ii = this.__currday.getMinutes(); 
		var _p = this.__getPosition(this.__controlid); 
		this.__calendar.style.display = 'block'; 
		this.__calendar.style.left = _p['x']+'px'; 
		this.__calendar.style.top = (_p['y'] + 20)+'px'; 
		
		nej.v._$stop(_event);
		
		this.__refreshCalendar(this.__currday.getFullYear(), this.__currday.getMonth()); 
		if(this.__lastcheckedyear != false) { 
			nej.e._$get('calendar_year_' + this.__lastcheckedyear).className = 'default'; 
			nej.e._$get('calendar_year_' + this.__today.getFullYear()).className = 'today'; 
		} 
		if(this.__lastcheckedmonth != false) 
		{ 
			nej.e._$get('calendar_month_' + this.__lastcheckedmonth).className = 'default'; 
			nej.e._$get('calendar_month_' + (this.__today.getMonth() + 1)).className = 'today'; 
		} 
		nej.e._$get('calendar_year_' + this.__currday.getFullYear()).className = 'checked'; 
		nej.e._$get('calendar_month_' + (this.__currday.getMonth() + 1)).className = 'checked'; 
		this.__hourMinute.style.display = this.__addtime ? '' : 'none'; 
		this.__lastcheckedyear = this.__currday.getFullYear(); 
		this.__lastcheckedmonth = this.__currday.getMonth() + 1; 
	};
	
	_pro.__refreshCalendar = function(_y, _m, _mtype) {
		_y = _y || this.__yy;
		switch(_mtype) {
			case 0:
				_m = this.__mm;
				break;
			case 1:
				_m = this.__mm - 1;
				break;
			case 2:
				_m = this.__mm + 1;
				break;
			default:
				break;
		}
		
		var x = new Date(_y, _m, 1); 
		var mv = x.getDay(); 
		var d = x.getDate(); 
		var dd = null; 
		this.__yy = x.getFullYear(); 
		this.__mm = x.getMonth(); 
		this.__year.innerHTML = this.__yy; 
		this.__month.innerHTML = this.__mm + 1 > 9 ? (this.__mm + 1) : '0' + (this.__mm + 1); 
		for(var i = 1; i <= mv; i++) { 
			dd = nej.e._$get("d" + i); 
			dd.innerHTML = " "; 
			dd.className = ""; 
		} 
		while(x.getMonth() == this.__mm) { 
			dd = nej.e._$get("d" + (d + mv)); 
			dd.innerHTML = '<a href="#" onclick="haitao.g.settime(' + d + ');return false">' + d + '</a>'; 
			if(x.getTime() < this.__today.getTime() || (this.__enddate && x.getTime() > this.__enddate.getTime()) || (this.__startdate && x.getTime() < this.__startdate.getTime())) { 
				dd.className = 'expire'; 
				if(!!this.__nochosebeforetime) {
					dd.innerHTML = '<a href="#" >' + d + '</a>'; 
				}
			} 
			else { 
				dd.className = 'default'; 
			} 
			
			if(x.getFullYear() == this.__today.getFullYear() && x.getMonth() == this.__today.getMonth() && x.getDate() == this.__today.getDate()) { 
				dd.className = 'today'; 
				dd.firstChild.title = '今天'; 
				dd.innerHTML = '<a href="#" onclick="haitao.g.settime(' + d + ');return false">' + d + '</a>'; 
			} 
			
			if(x.getFullYear() == this.__currday.getFullYear() && x.getMonth() == this.__currday.getMonth() && x.getDate() == this.__currday.getDate()) { 
				dd.className = 'checked'; 
			} 
			x.setDate(++d); 
		} 
		while(d + mv <= 42) { 
			dd = nej.e._$get("d" + (d + mv)); 
			dd.innerHTML = " "; 
			d++; 
		} 
		if(this.__addtime) { 
			this.__hour.value = this.__zeroFill(this.__hh); 
			this.__minute.value = this.__zeroFill(this.__ii);
		}
	};
	
	_pro.__showDiv = function(_id) {
		var _p = this.__getPosition(nej.e._$get(_id));
		nej.e._$get('calendar_' + _id).style.left = _p['x']+'px'; 
		nej.e._$get('calendar_' + _id).style.top = (_p['y'] + 16)+'px'; 
		nej.e._$get('calendar_' + _id).style.display = 'block'; 
	};
	
	_pro.__zeroFill = function(_s) {
		var _s = parseFloat(_s.toString().replace(/(^[\s0]+)|(\s+$)/g, '')); 
		_s = isNaN(_s) ? 0 : _s; 
		return (_s < 10 ? '0' : '') + _s.toString(); 
	};
	
//	_p._$$Calendar._$allocate({});
	
});
