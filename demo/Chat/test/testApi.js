/**
 * Created by jerry on 16/4/21.
 */
    'use strict';
    var options = {
        appId: '56de93ca667a2300013a0d67',
        clientId: 'REJWbDl6c2tieUtqZ3UxRThWNlZfdw',
        userId: 'foo',
        installId: "M3pyVEdsSFBBZm5UTDlLMTB3a0xYdw!"
    };
    var im = ML.im({
        appId: options.appId,
        clientId: options.clientId,
        userId: options.userId,
        installId: options.installId,
        region: 'cnTest'
    },function(){
        console.log('login success!');
    });
    function setResultData(data){
        data = JSON.stringify(data);
        localStorage.setItem("actionResult",data);
    }
    function getResultData(){
        return localStorage.getItem("actionResult");
    }
    function testApiList(action,callback){
        if (action == 'null')
            return;
        let skip = 0,
            userType = 1,
            size = 20,
            user ={
                'type':1
            },
            ts = Math.round(new Date().getTime()-86400*5),//获取5天内的聊天记录
                data = {
                "name": "隔壁老王",
                    "age": 46,
                    "gender": "male",
                    "foo": "bar",
                    "bar": "baz",
                    "baz": "qux"
            },
            passenger= {
                'id':"jerryJone",
                 'xxx':'hello',
                 'des':'我是一个游客',
                 'tel':1302013
            },
            result = {
                error:null,
                data:null
            };
        let nameT = 'foo';
        let installs =[
            'sfsfslsdflsdlf',
            'sdflssdiofsoifssdfsdfs'
        ];
        switch (action) {
                case 'userInfo':
                    im.userInfo(nameT, function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'searchUsers':
                    //获取用户
                    im.searchUsers(size, skip ,name ,{'name':'隔壁老王'}, function (error,data) { // size, skip ,name ,{'name':'隔壁老王'}
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'setUserAttributes':
                    //设置用户自定义属性
                    im.setUserAttributes(options.userId,data, function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'coverSetUserAttributes':
                    im.coverSetUserAttributes(options.userId,{name:'楼下小黑'}, function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                case 'getUserOneAttribute':
                    //获取用户某个自定义属性
                    im.getUserOneAttribute(options.userId,data.name, function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'getUserAttributes':
                    //获取用户自定义属性
                    im.getUserAttributes(options.userId, function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'rmUserAttributes':
                    // 删除自定义属性
                    im.rmUserAttributes(options.userId, function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'listGroups':
                    im.listGroups(options.userId, function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    },true);//false
                    break;
                case 'listRooms':
                    im.listRooms(options.userId, function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    },true);
                    break;
                case 'addOrModifyPassenger':
                    // 新增或修改游客信息
                    im.addOrModifyPassenger(passenger, function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'getPassenger':
                    //获取游客信息
                    im.getPassenger(passenger.id, function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'getPassengerRecentChat':
                    //获取游客聊天记录
                    im.getPassengerRecentChat(passenger.id,'jerry',ts,size,function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'searchGroups':
                    //查找群组
                    im.searchGroups(size,null,null,null, function (error,data) { //size,skip,'name',{'description':'搞基'}
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'setGroupAttributes':
                    //设置群组自定义属性
                    im.setGroupAttributes('4217fd2d424d47d78907c509b8bc8403',{name:'专业搞基群','description':'专业搞基一百年'},function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'coverSetGroupAttributes':
                    //覆盖设置群组自定义属性
                    im.coverSetGroupAttributes('4217fd2d424d47d78907c509b8bc8403',{'description':'专业搞基一百年 ,一百年永不变!'}, function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'getGroupAttributes':
                        //获取群组自定义属性
                    im.getGroupAttributes('4217fd2d424d47d78907c509b8bc8403', function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'getGroupOneAttribute':
                    //获取某个群组自定义属性
                    im.getGroupOneAttribute('4217fd2d424d47d78907c509b8bc8403','description', function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'rmGroupAttributes':
                    im.rmGroupAttributes('4217fd2d424d47d78907c509b8bc8403', function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'searchRooms':
                    im.searchRooms(size,skip,null,null, function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'setRoomAttributes':
                    //设置群组自定义属性
                    im.setRoomAttributes('c0eebb302b1345fd983345336dd4eaa6',{'type':'大家来聊天','description':'开心交流'},function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'coverSetRoomAttributes':
                    im.coverSetRoomAttributes('c0eebb302b1345fd983345336dd4eaa6',{'description':'专业:搞基一百年!'}, function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'getRoomAttributes':
                    im.getRoomAttributes('c0eebb302b1345fd983345336dd4eaa6', function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
                case 'getRoomOneAttribute':
                    im.getRoomOneAttribute('c0eebb302b1345fd983345336dd4eaa6','description', function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;

                case 'rmRoomAttributes':
                    im.rmRoomAttributes('c0eebb302b1345fd983345336dd4eaa6', function (error,data) {
                        result.error = error;
                        result.data = data;
                        setResultData(result);
                        callback();
                    });
                    break;
            }
    }

    $(function () {
       let caseList = {
                'null':'请选择',
                'userInfo':'用户详情',
                'searchUsers':'查找用户',
                'setUserAttributes':'设置用户自定义属性',
                'coverSetUserAttributes':'覆盖设置用户自定义属性',
                'getUserAttributes':'获取用户自定义属性',
                'getUserOneAttribute':'获取用户的某个自定义属性',
                'rmUserAttributes':'删除用户自定义属性',
                'listGroups':'查询用户加入的群组',
                'listRooms':'查询用户加入的聊天室',
                'addOrModifyPassenger':'新增或修改游客信息',
                'getPassenger':'获取游客信息',
                'getPassengerRecentChat':'获取游客聊天信息',
                'searchGroups':'搜索群组',
                'setGroupAttributes':'设置群组自定义属性',
                'coverSetGroupAttributes':'覆盖设置群组自定义属性',
                'getGroupAttributes':'获取群组自定义属性',
                'getGroupOneAttribute':'获取某个群组自定义属性',
                'rmGroupAttributes':'删除群组自定义属性',
                'searchRooms':'搜索聊天室',
                'setRoomAttributes':'设置聊天室自定义属性',
                'coverSetRoomAttributes':'覆盖设置聊天室自定义属性',
                'getRoomAttributes':'获取聊天室自定义属性',
                'getRoomOneAttribute':'获取某个聊天室自定义属性',
                'rmRoomAttributes':'删除聊天室自定义属性'
        };
        for (var api in caseList){
            $("#maxLeap-method-select").append('<option action ='+api+'>'+caseList[api]+'</option>');
        };
        $("#maxLeap-method-select").on('change', function (e) {
            $("#actionResult").html("");
            var action = $(e.target).find("option:selected").attr("action");
            testApiList(action, function () {
                var result = getResultData();
                result = result ? JSON.parse(result) : {error:null,data:null};
                var error = result.error;
                var data = result.data;
                if(error){
                    if(error.errorCode == 5004){
                        $("#actionResult").html(error.errorMessage).css("color", "green");
                    }else{
                        $("#actionResult").html(error.errorMessage).css("color", "red");
                    }
                }
                else if(data == '[]' || data == '{}' || data == 'null' || data == null || data ==undefined || data =='undefined' )
                    $("#actionResult").html("");
                else {
                    $("#actionResult").html(JSON.stringify(data)).css("color", "green");
                }
            });
        });
    });



