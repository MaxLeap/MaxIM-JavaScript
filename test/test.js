/**
 * Created by jerry on 16/4/26.
 */

'use strict';
const options = {
    appId: '5722fe2360b23771c2eee2b5',
    clientId: 'Z1NwNUhuT1pEMW0yZGN5RTVkMzZEdw',
    region: 'cn'
};
let im = ML.im(options);
let data= {
    size:20,
    ts:Math.round(new Date().getTime()-86400*5),//获取5天内的聊天记录,
    skip:0,
    sort:'name',
    data:{'description':'搞基'}
};

let user = {
    userId: 'zxz',
    installId: "M3pyVEdsSFBBZm5UTDlLMTB3a0xYdw!",
    attributes :{
        'name':"猴哥",
        'description':"我是猴哥我怕誰",
        'power':'3000000'
    },
    coverAttributes : {
        'name': "猴哥",
        'description': "我是齐天大圣",
        'power': '1000000000'
    },
    oneAttrName:'description'
};


let passenger= {
        'id':"passenger",
        'unique':'Hello',
        'des':'我是一个游客',
        'tel':1302013
};
let group ={
     id:'4217fd2d424d47d78907c509b8bc8403',
    attributes:  {
    'name':'专业搞基群',
    'description':'专业搞基一百年'
    },
    coverAttributes:{
    'name':'专业搞基群2',
    'description':'专业搞基一百年2'
    },
    oneAttrName:'description'
};
let room = {
    id:'ca1b4cd9fd534262a10b1200e7f4ff4d',
    attributes:{
    'type':'大家来聊天',
    'description':'开心交流'
    },
    coverAttributes:{
        'type':'聊天室一',
        'description':'这是一个聊天室'
    },
    oneAttrName:'description'
};
describe('user', function () {
    describe('#searchUsers', function () {
        it('should be return an array', function () {
            im.searchUsers(data.size,data.skip,null,null,function (error,data) {
                expect(data).be.an('array');
            })
        });
    });
    describe('#setUserAttributes', function () {
        it('should be return a object', function () {
            im.setUserAttributes(user.userId,user.attributes, function (error,data) {
                expect(data).be.an('object');
            });
        });
    });
    describe('#coverSetUserAttributes', function () {
        it('should be return a object', function () {
            im.coverSetUserAttributes(user.userId,user.coverAttributes, function (error,data) {
                expect(data).be.an('object');
            });
        });
    });

    describe('#getUserAttributes', function () {
        it('should be return a object', function () {
            im.getUserAttributes(user.userId, function (error,data) {
                expect(data).be.an('object');
            });
        });
    });
    describe('#getUserOneAttribute', function () {
        it('should be return a string', function () {
            im.getUserOneAttribute(user.userId,user.oneAttrName, function (error,data) {
                expect(data).be.an('string');
            });
        });
    });
    //describe('#rmUserAttributes', function () {
    //    it('should be return a object', function () {
    //        im.rmUserAttributes(user.userId, function (error,data) {
    //            expect(data).be.an('object');
    //        });
    //    });
    //});
});
describe('passenger', function () {
    describe('#addOrModifyPassenger', function () {
        it('should be return a string', function () {
            im.addOrModifyPassenger(passenger, function (error,data) {
                expect(data).be.an('string');
            });
        });
    });
    describe('#getPassenger', function () {
        it('should be return a object', function () {
            im.getPassenger(passenger.id, function (error,data) {
                expect(data).be.an('object');
            });
        });
    });
    describe('#getPassengerRecentChat', function () {
        it('should be return a array', function () {
            im.getPassengerRecentChat(passenger.id,'jerry',data.ts,data.size, function (error,data) {
                expect(data).be.an('array');
            });
        });
    });
});

describe('group', function () {
    describe('#searchGroups', function () {
        it('should be return a array', function () {
            im.searchGroups(data.size,null,null,null, function (error,data) {
                expect(data).be.an('array');
            });
        });
    });
    describe('#setGroupAttributes', function () {
        it('should be return a object', function () {
            im.setGroupAttributes(group.id,group.attributes, function (error,data) {
                expect(data).be.an('object');
            });
        });
    });
    describe('#coverSetGroupAttributes', function () {
        it('should be return a object', function () {
            im.coverSetGroupAttributes(group.id,group.coverAttributes, function (error,data) {
                expect(data).be.an('object');
            });
        });
    });
    describe('#getGroupAttributes', function () {
        it('should be return a object', function () {
            im.getGroupAttributes(group.id, function (error,data) {
                expect(data).be.an('object');
            });
        });
    });
    describe('#getGroupOneAttribute', function () {
        it('should be return a string', function () {
            im.getGroupOneAttribute(group.id,group.oneAttrName, function (error,data) {
                expect(data).be.an('string');
            });
        });
    });
    //describe('#rmGroupAttributes', function () {
    //    it('should be return a object', function () {
    //        im.rmGroupAttributes(group.id, function (error,data) {
    //            expect(data).be.an('object');
    //        });
    //    });
    //});
});
describe('room', function () {
    describe('#searchRooms', function () {
        it('should be return an array', function () {
            im.searchRooms(data.size,data.skip,null,null, function (error,data) {
                expect(data).be.an('array');
            });
        });
    });
    describe('#setRoomAttributes', function () {
        it('should be return a object', function () {
            im.setRoomAttributes(room.id,room.attributes, function (error,data) {
                expect(data).be.an('object');
            });
        });
    });
    describe('#coverSetRoomAttributes', function () {
        it('should be return a object', function () {
            im.coverSetRoomAttributes(room.id,room.coverAttributes, function (error,data) {
                expect(data).be.an('object');
            });
        });
    });
    describe('#getRoomAttributes', function () {
        it('should be return a object', function () {
            im.getRoomAttributes(room.id, function (error,data) {
                expect(data).be.an('object');
            });
        });
    });
    describe('#getRoomOneAttribute', function () {
        it('should be return a string', function () {
            im.getRoomOneAttribute(room.id,room.oneAttrName, function (error,data) {
                expect(data).be.an('string');
            });
        });
    });
    //describe('#rmRoomAttributes', function () {
    //    it('should be return a object', function () {
    //        im.rmRoomAttributes(room.id, function (error,data) {
    //            expect(data).be.an('object');
    //        });
    //    });
    //});
});
