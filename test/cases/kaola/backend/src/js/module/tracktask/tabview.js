/**
 * tab切换
 * author hale(hzhayue@corp.netease.com)
 */

define([
    'base/event',
    'base/element',
    'base/util',
    'base/global',
    'util/ajax/xdr',
    'pro/base/util',
    'pro/components/common/tabview',
    'pro/base/config',
    'ui/datepick/datepick',
    'pro/components/tracktask/update/dialog',
    'text!pro/components/tracktask/update/arrivalCabinetCount.html',
    'text!pro/components/tracktask/update/transportWay.html',
    'text!pro/components/tracktask/update/datetype.html',
    'text!pro/components/tracktask/update/comment.html'
], function(_v,_e, _u,_g, _j, ut, TabView, config,_p, Dialog, _tpl1, _tpl2, _tpl3, _tpl4) {

    var TabView = TabView.extend({
        taskUrl:config.URLPERFIX + '/backend/supplychain/tracktask/getTrackTasks',
        detailUrl:config.URLPERFIX + '/backend/supplychain/tracktask/auditDetail',
        params:{auditId:window.auditId},
        config: function(data) {
            ut.extend(data, {
                tasks:[],
                taskIndex:0,
                auditId:auditId,
                auditNo:auditNo,
                logs:auditLogs,
                products:[],
                auditOrder:{},
                auditStatus4Detail:auditStatus4Detail/1,
                uploadTaskId:'',
                lastTime:'',
                msg:''
            });
            this.supr(data);
        },
        init: function() {
            this.supr();
            this.$on('tabchange', this.__onTabChange._$bind(this));   
            this.$emit('tabchange',0);

            var _self = this;
            this.$on('msg', function() {
                alert(_self.data.msg);
            });
            
        },
        setTaskId:function(id, index) {
            this.data.uploadTaskId = id;
            this.data.taskIndex = index;
        },
        upload  :function(task) {
            var _self = this;
            _j._$upload('upload',{
                mode:0,
                cookie:true,
                onuploading:function(_data){},
                onload:function(data){
                    var _file = data.body,
                        params = {};
                    params.relatedId = _self.data.uploadTaskId;
                    params.attachmentName = _file.name;
                    params.attachmentUrl = _file.url;

                    _self.$request(config.URLPERFIX + '/backend/supplychain/tracktask/uploadAttachments', {
                        data:params,
                        method:'post',
                        onload:function(json) {
                            if (json.code == 200 && json.success ) {
                                var _index = _self.data.taskIndex;
                                _self.data.tasks[_index].attachments.push({
                                    attachmentUrl:_file.url,
                                    attachmentName:_file.name,
                                    id:json.data.attachment.id
                                }); 
                                _self.$update();
                            } else {
                                alert(json.message);
                            }
                        }
                    });
                }
            });
        },
        __onTabChange:function(val) {
            var _cb = val ? this.__reqDetail:this.__reqTask;
            _cb._$bind(this)();
        },
        __reqTask:function() {
            this.loading = true;
            this.$request(this.taskUrl, {
                data:this.params,
                onload:function(json) {
                    //清空数组
                    this.data.tasks.length = 0;
                    var _tasks = json.data.trackTaskDtos;
                    this.data.tasks.length = 0;  // 每次清空数组
                    this.data.tasks.push.apply(this.data.tasks,_tasks);
                    this.loading = false;
                }
            }); 
        },
        __reqDetail:function() {
            this.loading = true;
            this.$request(this.detailUrl, {
                data:this.params,
                onload:function(json) {
                    var _detail = json.data.auditDetailDto;
                    this.data.products.length = 0; // 每次清空数组
                    this.data.products.push.apply(this.data.products,_detail.outAuditGoodsDtoList);
                    _g.X(this.data.auditOrder, _detail.outAuditOrderDto);
                    this.loading = false;
                }

            });
        },
        __checkTasks:function() {
            var _item = {};
            for ( var i = 0, len = this.data.tasks.length; i < len ; i++ ) {
                _item = this.data.tasks[i];
                //如果已到港必定已起运，如果已到仓必定已到港，如果已理货必然已到仓
                var hasArrivedPort = _item.arrivalPortState == '是',
                    notTransport = _item.beginTransportState == '否',
                    hasArrivedWh = _item.arrivalWarehouseState == '是',
                    notArrivedPort = !hasArrivedPort,
                    hasTally = _item.tallyState == '是',
                    notTally = !hasTally,
                    notArrivedWh = !hasArrivedWh,
                    hasTransport = !notTransport;

                var _code = '采购单号：' + _item.purchaseOrder.id + ' 错误信息：';

                if ( hasArrivedPort && notTransport ) {
                    this.data.msg = _code + '如果已到港必定已起运，请维护完全跟单信息';
                    this.$emit('msg');
                    return false;
                }
                if ( hasArrivedWh && ( notArrivedPort || notTransport ) ) {
                    this.data.msg = _code + '如果已到仓必定已到港,请维护完全跟单信息';
                    return false;
                }
                if ( hasTally && ( notArrivedWh || notArrivedPort || notTransport )) {
                    this.data.msg = _code + '如果已理货必然已到仓,请维护完全跟单信息';
                    return false;
                }

                var _notempty = _item.arrivalCabinetCount && _item.ladingNumber
                             && _item.transportWayStr && _item.docRequiredTime;

                if ( !_notempty ) {
                    this.data.msg = _code + '请维护完全跟单信息';
                    return false;
                }

                _notempty = hasTransport && _item.beginTransportTime;
                if ( !_notempty ) {
                    this.data.msg = _code + '起运日期为空/未起运，请维护完全跟单信息';
                    return false;
                }

                _notempty = hasArrivedPort && _item.arrivalPortTime;
                if ( !_notempty ) {
                    this.data.msg = _code + '到港日期为空/未到港，请维护完全跟单信息';
                    return false;
                }
                _notempty = hasArrivedWh && _item.arrivalWarehouseTime;
                if ( !_notempty ) {
                    this.data.msg = _code + '到仓日期为空/未到仓，请维护完全跟单信息';
                    return false;
                }
                _notempty = hasTally && _item.tallyTime;
                if ( !_notempty ) {
                    this.data.msg = _code + '理货为空/未理货，请维护完全跟单信息';
                    return false;
                }

                if ( !_item.attachments.length ) {
                    this.data.msg = _code + '未上传附件';
                    return false;
                }
            }
            return true;
        },
        createTask:function() {
            var _url = '/backend/invoicing/order/create?auditId=' + window.auditId;
            if ( window.hasAllRelated == 'false' ) {
                alert('新品未全部关联');
            } else {
                window.open(_url,'_blank');
            }
        },
        submit:function() {
            if ( !this.data.tasks.length ) {
                this.data.msg = '请至少新增一条跟单任务';
            }
            var _flag = this.__checkTasks();
            if ( !_flag ) { this.$emit('msg'); return; }

            this.data.msg = '';
            // 校验成功
            var _config = {
                auditId:auditId,
                url:config.URLPERFIX + '/backend/supplychain/tracktask/trackTaskDone',
                title:'提示',
                name:'submitForm'
            }

            var _dialog = new Dialog({data:_config, content:_tpl4});
            var _self = this;
            _dialog.$inject(_e._$get('submitForm'));
            _dialog.$on('success', function(_data, json) {

                if ( json.code != 200 || !json.success ) {
                    _self.data.msg = json.message;
                    _self.$emit('msg');
                    _self.$update();
                } else {
                    window.location = window.location;
                }
            });
            
        },
        deleteAtm:function(taskIndex, atmIndex, taskId, atmId) {
            var _url = config.URLPERFIX + '/backend/supplychain/tracktask/deleteAttachment';
            this.$request(_url, {
                data:{
                    auditId:this.data.auditId,
                    taskId:taskId,
                    attachmentId:atmId,
                },
                onload:function(json) {
                    if ( json.code == 200 ) {
                        this.data.tasks[taskIndex].attachments.splice(atmIndex,1);
                        this.$update();
                    } else {
                        alert(json.message);
                    }
                }
            })

        },
        __datepick:function(name, lastTime) {
            // _v._$stop(_event);
            var _self = this;
            var _input = _e._$get('userdate'),
                _hinput = _e._$get(name);


            lastTime = lastTime || '';
            var _date = lastTime && _u._$format(lastTime,'yyyy-MM-dd');;
            _input.value = _date || ''; 
            _hinput.value = lastTime && new Date(lastTime).getTime();  
            _v._$addEvent(_input, 'click', function(e) {
                _v._$stop(e);

                _p._$$DatePick._$allocate({
                    parent:_input.parentNode,
                    date:_date,
                    onchange:function(_value) {
                        _input.value = _u._$format(_value,'yyyy-MM-dd');
                        _hinput.value = new Date(_value).getTime();
                    }
                })
            });
        },
        __update:function(taskId, conf, index, lastTime, url, tpl, name, callback) {
            var _config = {
                taskId:taskId,
                auditId:this.data.auditId,
                url:config.URLPERFIX  + url
            };
            _g.X(_config, conf);

            // if ( lastTime ) {
            //     this.data.lastTime = lastTime;
            // }
            var _self = this;
            var _dialog = new Dialog({data:_config, content:tpl});
            _dialog.$inject(_e._$get('updateForm'));
            
            name && this.__datepick(name, lastTime);

            _dialog.$on('success', function(_data, json) {
                if ( json.code != 200 || !json.success ) {
                    _self.data.msg =  json.message;
                    _self.$emit('msg');
                    _self.$update();
                    return;
                }
                _self.data.msg = '';

                callback(index, _data);
            });
        },
        updateArrivalCabinetCount:function(taskId, index, data1, data2) {
            var url = '/backend/supplychain/tracktask/updateArrivalAndLadingNum',
                conf= {
                    data1:data1 || '',
                    data2:data2
                };

            var _self = this;
            var callback = function(index, _data) {
                var _task = _self.data.tasks[index];
                    _task.arrivalCabinetCount = _data.arriveCount;
                    _task.ladingNumber = _data.ladingNumber;
                    _self.$update();
            }

            this.__update(taskId, conf, index, null, url, _tpl1, null, callback);
        },

        updateTransportWay:function(taskId, index, data1, lastTime) {
            
            var url = '/backend/supplychain/tracktask/updateTransportMode',
                conf= {
                    data1:(data1 == '是')/1
                }

            var _self = this;
            var callback = function(index, _data) {
                var _task = _self.data.tasks[index];

                var _mode = ['海运','陆运','空运'];
                _task.transportWayStr = _mode[_data.transportMode-1];
                _task.docRequiredTime = _data.docRequiredTime/1;
                _self.$update();
            }
            this.__update(taskId, conf, index, lastTime, url, _tpl2, 'docRequiredTime', callback);
        },
        updateTransportState:function(taskId, index, data1, lastTime) {
            
            var url  = '/backend/supplychain/tracktask/updateBeginTransport',
                conf = {
                dialogTitle1:'是否起运',
                dialogName1:'isBeginTransport',
                dialogTitle2:'起运时间',
                dialogName2:'beginTransportTime',
                data1:(data1 == '是')/1
            };

            var _self = this;
            var callback = function(index, _data) {
                var _task = _self.data.tasks[index];

                var _mode = ['否','是'];
                _task.beginTransportState = _mode[_data.isBeginTransport];
                _task.beginTransportTime = _data.beginTransportTime/1;
                _self.$update();
            }

            this.__update(taskId, conf, index, lastTime,url, _tpl3, 'beginTransportTime', callback);
        }, 
        updateArrivalPortState:function(taskId, index,data1, lastTime) {

            var url = '/backend/supplychain/tracktask/updateArrivePort';

            var conf = {
                dialogTitle1:'是否到港',
                dialogName1:'isArrivePort',
                dialogTitle2:'到港日期',
                dialogName2:'arrivePortTime',
                data1:(data1 == '是')/1
            };
            var _self = this;
            var callback = function(index, _data) {
                var _task = _self.data.tasks[index];

                var _mode = ['否','是'];
                _task.arrivalPortState = _mode[_data.isArrivePort];
                _task.arrivalPortTime = _data.arrivePortTime/1;
                _self.$update();
            }

            this.__update(taskId, conf, index, lastTime, url, _tpl3, 'arrivePortTime', callback);
        },
        updateArrivalWarehouseState:function(taskId, index, data1,lastTime) {
            var url = '/backend/supplychain/tracktask/updateArriveWarehouse';
            var conf = {
                dialogTitle1:'是否到仓',
                dialogName1:'isArrivalWarehouse',
                dialogTitle2:'到仓时间',
                dialogName2:'arriveWarehouseTime',
                data1:(data1 == '是')/1
            };
            var _self = this;
            var callback = function(index, _data) {
                var _task = _self.data.tasks[index];

                var _mode = ['否','是'];
                _task.arrivalWarehouseState = _mode[_data.isArrivalWarehouse];
                _task.arrivalWarehouseTime = _data.arriveWarehouseTime/1;
                _self.$update();
            }

            this.__update(taskId, conf, index, lastTime, url, _tpl3, 'arriveWarehouseTime', callback);

        },
        updateTallyState:function(taskId, index,data1, lastTime) {
            var url = '/backend/supplychain/tracktask/updateTally';

            var conf = {
                dialogTitle1:'是否理货',
                dialogName1:'isTally',
                dialogTitle2:'理货日期',
                dialogName2:'tallyTime',
                data1:(data1 == '是')/1
            }

            var _self = this;
            var callback = function(index, _data) {
                var _task = _self.data.tasks[index];

                var _mode = ['否','是'];
                _task.tallyState = _mode[_data.isTally];
                _task.tallyTime = _data.tallyTime/1;
                _self.$update();
            }
            this.__update(taskId, conf, index, lastTime, url, _tpl3, 'tallyTime', callback);
        }
    });

    TabView.directive('nav-form', function(ele, value) {
        _v._$addEvent(ele,'mouseover',function(_event){
            var _form = _e._$get('upload');
            
            _form.style.top = _event.layerY + 'px';
            _form.style.left = _event.layerX + 'px';
        },false);
    });

    TabView.filter('time', function(value) {
        value = value || '';
        if ( value ) {
            var _date = new Date(value);
            value = _date.getFullYear() + '-' + ( _date.getMonth() + 1 ) + '-' + _date.getDate();
        }
        return value;
    });

    TabView.filter('timeHMS', function(value) {
        if ( value ) {
           return _u._$format(value,'yyyy-MM-dd HH:mm:ss');;
        }
        return '';
    });

    return TabView;

});