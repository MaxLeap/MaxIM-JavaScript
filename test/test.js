/**
 * Created by jerry on 16/4/26.
 */

'use strict';
const options = {
    appId: '56a86320e9db7300015438f7',
    clientId: 'M3pyVEdsSFBBZm5UTDlLMTB3a0xYdw',
    region: 'cnTest'
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
    userId: 'foo',
    installId: "M3pyVEdsSFBBZm5UTDlLMTB3a0xYdw!"
};

let attributes ={
    'name':"猴哥",
    'description':"我是猴哥我怕誰",
    'power':'3000000'
};

let coverAttributes = {
    'name':"猴哥",
    'description':"我是齐天大圣",
    'power':'1000000000'
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
        it('should be return an object', function () {
            im.setUserAttributes(user.userId,attributes, function (error,data) {
                expect(data).be.an('object');
            });
        });
    });
    describe('#coverSetUserAttributes', function () {
        it('should be return an object', function () {
            im.coverSetUserAttributes(user.userId,coverAttributes, function (error,data) {
                expect(data).be.an('object');
            });
        });
    });
});
