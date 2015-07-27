/*
 * --------------------------------------------
 * xx控件实现
 * @version  1.0
 * @author   author(author@corp.netease.com)
 * --------------------------------------------
 */
define(
		[ 'base/util'
		  , 'base/event'
		  , 'base/element'
		  ,	'util/event'
		  , 'ui/base'
		  , 'util/template/tpl'
		  , 'text!./calendar.css'
	      , 'text!./calendar.html'
	      , 'util/template/jst'
	      , 'pro/base/request'
	      , 'pro/components/modal/setholiday/holiday'
	      , 'pro/components/notify/notify'],
		function(u, v, e, t, i,e1,css,html,e2,Request,HolidayModal,notify,p, o, f, r) {
			var pro,
			_seed_css = e._$pushCSSText(css),
			_seed_html,
	        _seed_ui = e1._$parseUITemplate(html),
	        _seed_date = _seed_ui['seedDate'],
	        _seed_action = _seed_ui['seedAction'],
	        //_holidayCache ={'2015':{1:{3:'元旦'},4:{5:'清明节'},5:{3:'劳动节'}}},
	        _holidayCache ={},
	        _monthDays =[31,28,31,30,31,30,31,31,30,31,30,31];
			/**
			 * 全局状态控件
			 * 
			 * @class {nm.i._$$Calendar}
			 * @extends {nej.ui._$$Abstract}
			 */
			p._$$Calendar = NEJ.C();
			pro = p._$$Calendar._$extend(i._$$Abstract);
			/**
			 * 重置控件
			 * 
			 * @param {[type]}
			 *            options [description]
			 * 
			 */
			pro.__reset = function(options) {
				options.parent = options.parent || document.body;
				this.__super(options);
				this.now = new Date();
				this.__getYearHoliday(this.now.getFullYear());
			};
			
			
			pro.__onError = function(){
				
			};
			pro.__getYearHoliday = function(year){
				this.year.innerText = year;
				this.month.innerText = (this.now.getMonth()+1);
				if(!_holidayCache[year]){
					Request('/backend/dw/period/get/holiday',{
						method:'GET',
						type:'json',
						norest:true,
						query:u._$object2query({year:year}),
						onload:this.__cbGetYearHoliday._$bind(this,year),
						onerror:this.__onError._$bind(this)})
				} else{
					this.__cbGetYearHoliday(year,{code:200,data:{body:_holidayCache[year]}})
				}
			}
			pro.__cbGetYearHoliday = function(year,result){
				if(result.code==200){
					_holidayCache[year] = result.data.body;
					var days = this.__getMonthDays(this.now);
					//var holidays = result.holidays;
					e2._$render(this.monthTbl,_seed_date,{data:days});
				}
			};
			pro.__getMonthDays = function(date){
				date.setDate(1);
				var day = date.getDay();
				var month = date.getMonth();
				if(month==1){
					days = this.__getFebruaryDays(date);
				} else{
					days = _monthDays[date.getMonth()];
				}
				var list = this.__getPreMonthDays(date,day);
				for(var i=1;i<=days;i++){
					var cloneDate = new Date();
					cloneDate.setMonth(month);
					cloneDate.setDate(i);
					cloneDate.setFullYear(date.getFullYear());
					list.push({state:0,date:i,day:cloneDate,isInMonth:true,holidayName:this.__isHoliday(cloneDate)});
				}
				var remains = (7-list.length%7+1);
				for(var i=1;i<remains;i++){
					var cloneDate = new Date();
					cloneDate.setMonth(month+1);
					cloneDate.setDate(i);
					cloneDate.setFullYear(date.getFullYear());
					list.push({date:i,day:cloneDate,isInMonth:false,holidayName:this.__isHoliday(cloneDate)});
				}
				return list
			};
			pro.__getFebruaryDays = function(date){
				return new Date(date.getFullYear() , 2 , 0).getDate();
			};
			pro.__getPreMonthDays = function(date,day){
				var list = [];
				var tdata = new Date(date);
				tdata.setDate(0);
				var preMontLastDate = tdata.getDate();
				for(var i=preMontLastDate-day+1;i<=preMontLastDate;i++){
					var cloneDate = new Date();
					cloneDate.setMonth(tdata.getMonth());
					cloneDate.setDate(i);
					cloneDate.setFullYear(tdata.getFullYear());
					list.push({state:-1,date:i,day:cloneDate,isInMonth:false,holidayName:this.__isHoliday(cloneDate)});
				}
				return list
			}
			
			pro.__isHoliday = function(date){
				return this.__initHoliday(date);
			};
			/**
			 * 控件销毁
			 * 
			 */
			pro.__destroy = function() {
				this.__super();
			};
			/**
			 * 初使化UI
			 */
			pro.__initXGui = function() {
				// 在正常开发中不太会把样式写在js中，_seed_css写在样式文件中，
				// this.__seed_html如果不设id上去，ui的父类会做一次this.__initNodeTemplate()操作，在样例中把this.__seed_html不设值了
				// 这里的ntp模板可以放在html的模板里，模板一定要parseTemplate才能取到这个id
				// this.__seed_html = 'wgt-ui-xxx';
				this.__seed_css  = _seed_css;
		        this.__seed_html = _seed_html;
			};

			/**
		     * 动态构建控件节点模板
		     *
		     * @protected
		     * @method module:ui/datepick/datepick._$$DatePick#__initNodeTemplate
		     * @return {Void}
		     */
		    pro.__initNodeTemplate = function(){
		        _seed_html = e1._$addNodeTemplate(e1._$getTextTemplate(_seed_action));
		        this.__seed_html = _seed_html;
		    };
			/**
			 * 节点初使化
			 * 
			 */
			pro.__initNode = function() {
				this.__super();
				var list = e._$getByClassName(this.__body, 'z-tag');
				this.preMonth = list[0];
				this.nxtMonth = list[1];
				this.year = list[2];
				this.month = list[3];
				this.monthTbl = list[4];
				v._$addEvent(this.preMonth,'click',this.__onPreMonthClick._$bind(this));
				v._$addEvent(this.nxtMonth,'click',this.__onNxtMonthClick._$bind(this));
				v._$addEvent(this.__body,'click',this.__onTableClick._$bind(this));
			};
			pro.__onPreMonthClick = function(){
				var month = this.now.getMonth();
				if(month==0){
					this.now.setFullYear(this.now.getFullYear()-1,11);
				} else{
					this.now.setMonth(month-1);
				}
				this.__getYearHoliday(this.now.getFullYear());
			};
			pro.__onNxtMonthClick = function(){
				var month = this.now.getMonth();
				if(month==11){
					this.now.setFullYear(this.now.getFullYear()+1,0);
				} else{
					this.now.setMonth(month+1);
				}
				this.__getYearHoliday(this.now.getFullYear());
			};
			pro.__initHoliday  = function(holiday,_name,_forceSet){
				var year = holiday.getFullYear();
				var month = holiday.getMonth()+1;
				var date = holiday.getDate();
				if(!_holidayCache[year]){
					_holidayCache[year] ={};
				}
				if(!_holidayCache[year][month]){
					_holidayCache[year][month] ={};
				}
				if(_name||_forceSet){
					_holidayCache[year][month][date] = _name;
				}
				return _holidayCache[year][month][date];
			}
			pro.__onTableClick = function(event){
				var elm = v._$getElement(event);
				if(e._$hasClassName(elm,' j-set')){
					var name = e._$dataset(elm,'name');
					var date = e._$dataset(elm,'date');
					var modal = new HolidayModal({data:{name:name,date:date}});
					modal.$on('confirm',function(_name,_date){
						var holiday = u._$var2date(_date);
						this.__initHoliday(holiday,_name,true);
						this.__getYearHoliday(this.now.getFullYear());
					}._$bind(this))
				} else if(e._$hasClassName(elm,'j-remove')){
					var date = u._$var2date(e._$dataset(elm,'date'));
					Request('/backend/dw/period/holiday/remove',{
		        		data:u._$object2query({
		        			date:date.getTime()
		        		}),
		        		method:'POST',
		        		type:'json',
		        		norest:true,
		        		onload:function(_json){
		        			if(_json.code==200){
		        				notify.show('取消成功');
		        				var holiday = date;
								this.__initHoliday(holiday,'',true);
								this.__getYearHoliday(this.now.getFullYear());
		        			}
		        		}._$bind(this)
					})
				}
			}
			return p._$$Calendar;
		})