/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

 var App = function() {
   return {
     options: {},
     data:{},
     im: undefined,
     init: function(){
       var self = this;
       postal.subscribe({
        channel: "sys",
        topic: "login",
        callback: function(data, envelope) {
          self.options = _.extend(self.options, data);
          self.login();
        }
    });
     },
     start: function(){
       this.init();
       ReactDOM.render(
         <ChatApp />,
         document.getElementById('content')
       );
     },
     login: function(){
       var self = this;
       this.im = ML.im({
         appId: this.options.appId,
         clientId: this.options.clientId,
         userId: this.options.userId,
         installId: this.options.installId,
         region: 'cn'
       },function(){
         self.run();
       });
     },
     run: function(){
       var self = this;
       self.im.onMessage(function(data) {
         console.log("rev one");
         console.log(data);
         if(data.from.type == 0 || data.from.type === undefined){
           postal.publish({
                channel: "message",
                topic: data.from.id+'.0.new',
                data: data
           });
         }else if(data.from.type == 1){
           postal.publish({
                channel: "message",
                topic: data.from.gid+'.1.new',
                data: data
           });
         }else if(data.from.type == 2){
           postal.publish({
                channel: "message",
                topic: data.from.gid+'.2.new',
                data: data
           });
         }

       });
       self.im.online(function(data) {
         postal.publish({
              channel: "sys",
              topic: "friend.online",
              data: data
         });
       });
       self.im.offline(function(data) {
         postal.publish({
              channel: "sys",
              topic: "friend.offline",
              data: data
         });
       });
       self.im.sys(function(data) {
         postal.publish({
               channel: "sys",
               topic: "alert",
               data: data
          });
       });
       self.im.yourself(function(data) {
         postal.publish({
              channel: "message",
              topic: data.to.id+'.yourself.new',
              data: data
         });
       });
       self.getFriends(self);
       self.getGroups(self);
       self.getRooms(self);
       setInterval(self.getFriends, 5000, this);
       setInterval(self.getGroups, 5000, this);
       setInterval(self.getRooms, 5000, this);

       postal.subscribe({
        channel: "sys",
        topic: "add",
        callback: function(data, envelope) {
          if(data.type =='friend'){
            self.im.addFriend(self.options.userId, data.id, function(err, data){
              self.getFriends(self);
            });
          }else if(data.type =='group') {
            var opts = {};
            opts.owner = self.options.userId;
            opts.name = data.id;
            opts.members = [self.options.userId];
            self.im.addGroup(opts, function(err, data){
              self.getGroups(self);
            });
          }else {
            var opts = {};
            opts.name = data.id;
            opts.members = [self.options.userId];
            self.im.addRoom(opts, function(err, data){
              self.getRooms(self);
            });
          }
        }
       });
       postal.subscribe({
        channel: "sys",
        topic: "group.addmember",
        callback: function(data, envelope) {
          self.im.addGroupMembers(data.id, {members:data.members}, function(err, data){
          });
        }
       });
       postal.subscribe({
        channel: "sys",
        topic: "group.rmmember",
        callback: function(data, envelope) {
          self.im.rmGroupMembers(data.id, {members:data.members}, function(err, data){
          });
        }
       });
       postal.subscribe({
        channel: "sys",
        topic: "group.destory",
        callback: function(data, envelope) {
          self.im.rmGroup(data.id, function(err, data){
            self.getGroups(self);
          });
        }
       });

       postal.subscribe({
        channel: "sys",
        topic: "room.addmember",
        callback: function(data, envelope) {
          self.im.addRoomMembers(data.id, {members:data.members}, function(err, data){
          });
        }
       });
       postal.subscribe({
        channel: "sys",
        topic: "room.rmmember",
        callback: function(data, envelope) {
          self.im.rmRoomMembers(data.id, {members:data.members}, function(err, data){
          });
        }
       });
       postal.subscribe({
        channel: "sys",
        topic: "room.destory",
        callback: function(data, envelope) {
          self.im.rmRoom(data.id,function(err, data){
            self.getRooms(self);
          });
        }
       });

       postal.subscribe({
        channel: "sys",
        topic: "friend.delete",
        callback: function(data, envelope) {
          self.im.rmFriend(self.options.userId, data.id, function(err, data){
            self.getFriends(self);
          });
        }
       });

       postal.subscribe({
        channel: "message",
        topic: "send",
        callback: function(data, envelope) {
          console.log("send one");
          console.log(data);
          if (data.to.type == "friends"){
              var msg = self.im.toFriend(data.to.id);
              if (data.content.media == 0){
                msg.text(data.content.body).ok();
              }else if(data.content.media == 1){
                msg.image(data.content.body).ok();
              }
          }else if(data.to.type == "groups"){
            var msg = self.im.toGroup(data.to.id);
            if (data.content.media == 0){
              msg.text(data.content.body).ok();
            }
         }else if(data.to.type == "rooms"){
           var msg = self.im.toRoom(data.to.id);
           if (data.content.media == 0){
             msg.text(data.content.body).ok();
           }
         }else{
           console.error("Wrong type: "+data.to.type);
         }
        }
       });
     },
     getFriends: function(self) {
       self.im.listFriends(self.options.userId, function(err, data) {
         postal.publish({
              channel: "sys",
              topic: "friend.list",
              data: data
         });
       }, true);
     },
     getGroups: function(self) {
       self.im.listGroups(self.options.userId, function(err, data) {
         postal.publish({
              channel: "sys",
              topic: "group.list",
              data: data
         });
       }, true);
     },
     getRooms: function(self) {
       self.im.listRooms(self.options.userId, function(err, data) {
         postal.publish({
              channel: "sys",
              topic: "room.list",
              data: data
         });
       }, true);
     }
   }
 }();

 var ChatApp = React.createClass({
   getInitialState: function(){
     return {};
   },
   componentDidMount: function() {
   },
   render: function() {
     return (
       <div className="ChatApp">
         <Alert />
         <Login />
         <Add />
         <ToolBar />
         <ConvList />
         <ConvMain />
       </div>
     );
   }
 });

 var Alert = React.createClass({
   getInitialState: function(){
     return {msg:''};
   },
  componentDidMount: function(){
    var self = this;
    postal.subscribe({
       channel: "sys",
       topic: "alert",
       callback: function(data, envelope) {
         if (data.content.media == 0) {
           self.setState({msg:data.content.body});
         }
       }
    });
    setTimeout(function(){
      $("#sys-alert").alert('close');
    }, 10000);
  },
  render: function(){
    if (this.state.msg) {
      return (
        <div className="Alert">
          <div className="alert alert-info alert-dismissible fade in" role="alert" id="sys-alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <strong>系统通知:    </strong> {this.state.msg}
          </div>
        </div>
      );
    }else {
      return (
        <div className="Alert">
        </div>
      );
    }

  }
 })

 var Login = React.createClass({
   getInitialState: function(){
     return {
       appId: '56d41c6c667a230001275f41',
       clientId: 'Y3FxbHE2aTJmQ2dQazYtQVlvc0NnQQ',
       userId: 'zhoucen',
       installId: "M3pyVEdsSFBBZm5UTDlLMTB3a0xYdw!"
     }
   },
   componentDidMount: function() {
     $('#Login').modal('show');
   },
   login: function() {
     postal.publish({
        channel: "sys",
        topic: "login",
        data: this.state
    });
     $('#Login').modal('hide');
   },
   render: function() {
     return (
       <div className="modal fade" id="Login">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">登录</h4>
            </div>
            <div className="modal-body">
            <div className="input-group">
              <span className="input-group-addon" id="basic-addon1">AppId</span>
              <input type="text" className="form-control" placeholder="AppId" aria-describedby="basic-addon1" id="appId" value={this.state.appId} onChange={this.onChange} />
            </div>
            <div className="input-group">
              <span className="input-group-addon" id="basic-addon1">ClientId</span>
              <input type="text" className="form-control" placeholder="ClientId" aria-describedby="basic-addon1" id="clientId" value={this.state.clientId} onChange={this.onChange} />
            </div>
            <div className="input-group">
              <span className="input-group-addon" id="basic-addon1">UserId</span>
              <input type="text" className="form-control" placeholder="UserId" aria-describedby="basic-addon1" id="userId" value={this.state.userId} onChange={this.onChange} />
            </div>
            <div className="input-group">
              <span className="input-group-addon" id="basic-addon1">InstallId</span>
              <input type="text" className="form-control" placeholder="InstallId" aria-describedby="basic-addon1" id="installId" value={this.state.installId} onChange={this.onChange} />
            </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={this.login} >Login</button>
            </div>
          </div>
        </div>
      </div>
     );
   },
   onChange: function(e){
     var state = {};
     state[e.target.id] = e.target.value;
     this.setState(state);
   }
 });

 var Add = React.createClass({
   getInitialState: function(){
     return {
       type:'friend',
       id:''
     }
   },
   componentDidMount: function() {
     $('#Add').modal('hide');
   },
   add: function() {
     if (this.state.id == ''){
       return;
     }
     postal.publish({
        channel: "sys",
        topic: "add",
        data: this.state
     });
     $('#Add').modal('hide');
   },
   render: function(){
     return (
       <div className="modal fade" id="Add">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">添加</h4>
            </div>
            <div className="modal-body">
              <ul className="nav nav-tabs" role="tablist">
                <li role="presentation" className="active" onClick={this.setTypeFriend} ><a href="#add-friend" aria-controls="add-friend" role="tab" data-toggle="tab">好友</a></li>
                <li role="presentation" onClick={this.setTypeGroup} ><a href="#add-group" aria-controls="add-group" role="tab" data-toggle="tab">创建群</a></li>
                <li role="presentation" onClick={this.setTypeRoom} ><a href="#add-room" aria-controls="add-room" role="tab" data-toggle="tab">创建聊天室</a></li>
              </ul>
              <div className="tab-content">
                <div role="tabpanel" className="tab-pane active" id="add-friend">
                  <input type="text" className="form-control" placeholder="UserId" aria-describedby="basic-addon1" id="add-UserId" value={this.state.id} onChange={this.onChange} />
                </div>
                <div role="tabpanel" className="tab-pane" id="add-group">
                  <input type="text" className="form-control" placeholder="GroupName" aria-describedby="basic-addon1" id="add-GroupName" value={this.state.id} onChange={this.onChange} />
                </div>
                <div role="tabpanel" className="tab-pane" id="add-room">
                  <input type="text" className="form-control" placeholder="RoomName" aria-describedby="basic-addon1" id="add-RoomName" value={this.state.id} onChange={this.onChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={this.add} >Add</button>
            </div>
          </div>
        </div>
      </div>
     );
   },
  onChange: function(e){
    this.setState({id:e.target.value});
  },
  setType: function(type){
    this.setState({type:type});
  },
  setTypeFriend: function(e){
    this.setType('friend');
  },
  setTypeGroup: function(e){
    this.setType('group');
  },
  setTypeRoom: function(e){
    this.setType('room');
  }
 });

 var AddMemeber = React.createClass({
   getInitialState: function(){
     return {
       id:'',
       type:''
     }
   },
   componentDidMount: function() {
     $('#AddMemeber').modal('hide');
   },
   add: function() {
     if (this.state.id == ''){
       return;
     }
     var topic = 'group.addmember';
     if (this.props.type == 'rooms'){
       topic = 'room.addmember';
     }
     postal.publish({
        channel: "sys",
        topic: topic,
        data: {
          id: this.props.id,
          members: [this.state.id]
        }
     });
     $('#AddMemeber').modal('hide');
   },
   render: function(){
     return (
       <div className="modal fade" id="AddMemeber">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">添加成员</h4>
            </div>
            <div className="modal-body">
            <div className="input-group">
              <span className="input-group-addon" id="basic-addon1">MemberId</span>
              <input type="text" className="form-control" placeholder="MemberId" aria-describedby="basic-addon1" id="MemberId" value={this.state.id} onChange={this.onChange} />
            </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={this.add} >Add</button>
            </div>
          </div>
        </div>
      </div>
     );
   },
  onChange: function(e){
    this.setState({id:e.target.value});
  }
 });

 var RmMemeber = React.createClass({
   getInitialState: function(){
     return {
       id:''
     }
   },
   componentDidMount: function() {
     $('#RmMemeber').modal('hide');
   },
   rm: function() {
     if (this.state.id == ''){
       return;
     }
     var topic = 'group.rmmember';
     if (this.props.type == 'rooms'){
       topic = 'room.rmmember';
     }
     postal.publish({
        channel: "sys",
        topic: topic,
        data: {
          groupid: this.props.id,
          members: [this.state.id]
        }
     });
     $('#RmMemeber').modal('hide');
   },
   render: function(){
     return (
       <div className="modal fade" id="RmMemeber">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">删除成员</h4>
            </div>
            <div className="modal-body">
            <div className="input-group">
              <span className="input-group-addon" id="basic-addon1">MemberId</span>
              <input type="text" className="form-control" placeholder="MemberId" aria-describedby="basic-addon1" id="MemberId" value={this.state.id} onChange={this.onChange} />
            </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={this.rm} >Add</button>
            </div>
          </div>
        </div>
      </div>
     );
   },
  onChange: function(e){
    this.setState({id:e.target.value});
  }
 });

 var ToolBar = React.createClass({
   render: function(){
       return (
         <div className="ToolBar">
           <ToolBarHeader />
           <Bar id="friends" icon="icon-user icon-4x" />
           <Bar id="groups" icon="icon-group icon-4x" />
           <Bar id="rooms" icon="icon-comments icon-4x" />
           <Bar id="add" icon="icon-plus icon-4x" />
         </div>
       );
   }
 });

 var ToolBarHeader = React.createClass({
   getInitialState: function() {
     return {
       title: ""
     }
   },
   componentDidMount: function() {
     postal.subscribe({
       hannel: "sys",
       topic: "username",
       callback: function(data, envelope) {
         console.log(data);
         self.setState({title:data});
       }
     });
   },
   render: function(){
     return (
       <nav className="navbar navbar-default Header">
         <div className="container-fluid">
           <div className="navbar-header">
             <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
               <span className="sr-only">Toggle navigation</span>
               <span className="icon-bar"></span>
               <span className="icon-bar"></span>
               <span className="icon-bar"></span>
             </button>
             <a className="navbar-brand" href="#">{this.state.title}</a>
           </div>
         </div>
       </nav>
     );
   }
 });

 var Bar = React.createClass({
   click: function(){
     if (this.props.id != 'add'){
       postal.publish({
            channel: "sys",
            topic: "choosebar",
            data: {'type':this.props.id}
       });
     }else{
       $('#Add').modal('show');
     }

   },
   render: function() {
     return (
       <button type="button" className=" Bar btn btn-default" onClick={this.click}><i className={this.props.icon}></i></button>
     );
   }
 });

 var ConvList = React.createClass({
   getInitialState: function() {
     return {data: [],friends:[], groups:[], rooms:[], type:'friends'};
   },
   componentDidMount: function() {
     var self = this;
     postal.subscribe({
      channel: "sys",
      topic: "group.list",
      callback: function(data, envelope) {
        self.setState({groups:data});
      }
     });
     postal.subscribe({
      channel: "sys",
      topic: "friend.list",
      callback: function(data, envelope) {
        self.setState({friends:data});
      }
     });
     postal.subscribe({
      channel: "sys",
      topic: "room.list",
      callback: function(data, envelope) {
        self.setState({rooms:data});
      }
     });
     postal.subscribe({
      channel: "sys",
      topic: "choosebar",
      callback: function(data, envelope) {
        self.setState({type:data.type});
      }
     });
     postal.subscribe({
      channel: "sys",
      topic: "friend.online",
      callback: function(data, envelope) {
        self.state.friends.map(function(friend) {
          if (friend.id == data){
            friend.online = true;
          }
        });
        self.setState({friends:self.state.friends});
      }
     });
     postal.subscribe({
      channel: "sys",
      topic: "friend.offline",
      callback: function(data, envelope) {
        self.state.friends.map(function(friend) {
          if (friend.id == data){
            friend.online = false;
          }
        });
        self.setState({friends:self.state.friends});
      }
     });
   },
   render: function() {
     var self = this;
     var friendConvs = self.state.friends.map(function(friend) {
       var online = "";
       if (friend.online){
         online = "online";
       }else{
         online = "offline";
       }
       return (
         <Conversation id={friend.id} name={friend.id} type="friends" key={friend.id} isshow={self.state.type == "friends"} icon="icon-user icon-3x" online={online} />
       );
     });
     var groupConvs = self.state.groups.map(function(group) {
       return (
         <Conversation id={group.id} name={group.name} type="groups" key={group.id} isshow={self.state.type == "groups"} icon="icon-group icon-3x" />
       );
     });
     var roomsConvs = self.state.rooms.map(function(room) {
       return (
         <Conversation id={room.id} name={room.name} type="rooms" key={room.id} isshow={self.state.type == "rooms"} icon=" icon-comments icon-3x" />
       );
     });
     return (
       <div className="ConvList list-group">
       <ConvListHeader type={this.state.type} />
       {friendConvs}
       {groupConvs}
       {roomsConvs}
       </div>
     );
   }
 });

var ConvListHeader = React.createClass({
  render: function(){
    var title = "好友";
    if (this.props.type == "groups"){
      title = "群组";
    }else if (this.props.type == "rooms") {
      title = "聊天室";
    }
    return (
      <nav className="navbar navbar-default Header">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">{title}</a>
          </div>
        </div>
      </nav>
    );
  }
});

var Conversation = React.createClass({
  getInitialState:function(){
    return {
      msgs: [],
      isshow: false,
      unread:[]
    }
  },
  choose: function(e){
    this.state.isshow = true;
    this.state.unread = [];
    postal.publish({
      channel: "sys",
      topic: "choose",
      data: {type:this.props.type, msgs:this.state.msgs, id: this.props.id, name: this.props.name}
    });
  },
  componentDidMount: function(){
    var self = this;
    var topic = "";
    if (this.props.type == "friends"){
      topic = this.props.id + ".0.new"
      App.im.getRecentChat(App.options.userId,this.props.id, new Date().getTime(), 50, function(err, data){
        console.log(data);
      })
    }else if(this.props.type == "groups"){
      topic = this.props.id + ".1.new"
      App.im.getGroupChat(App.options.userId,this.props.id, new Date().getTime(), 50, function(err, data){
        console.log(data);
      })
    }else if (this.props.type == "rooms") {
      topic = this.props.id + ".2.new"
    }
    postal.subscribe({
     channel: "message",
     topic: topic,
     callback: function(data, envelope) {
       self.state.msgs.push(data);
       if(!self.state.isshow){
         self.state.unread.push(data);
         self.setState({unread:self.state.unread});
       }else{
         postal.publish({
          channel: "now-message",
          topic: "new",
          data: data
        });
       }
     }
    });
    postal.subscribe({
     channel: "message",
     topic: this.props.id + ".yourself.new",
     callback: function(data, envelope) {
       self.state.msgs.push(data);
       if(!self.state.isshow){
         self.state.unread.push(data);
         self.setState({unread:self.state.unread});
       }else{
         postal.publish({
          channel: "now-message",
          topic: "new",
          data: data
        });
       }
     }
    });
  }
  ,
  render: function() {
    var className = "Conversation list-group-item ";
    var badgeclass = "badge ";
    var online = ""
    if(this.state.unread.length == 0){
      badgeclass = badgeclass + "hide";
    }
    if (!this.props.isshow){
      className = className + "hide";
    }

    if (this.props.online == "online"){
      online = " icon-bell-alt";
    }else if(this.props.online == "offline") {
      online = " icon-bell";
    }

      return (
        <button type="button" className={className} onClick={this.choose}>
          <div className="icon"><i className={this.props.icon}></i></div>
          <div className="name">{this.props.name}</div>
          <div className="online"><i className={online}></i></div>
          <div className="unread"><span className={badgeclass}>{this.state.unread.length}</span></div>

        </button>
      );
  }
});

var ConvMain = React.createClass({
  getInitialState: function(){
    return {
      msgs: [],
      data: {},
      type: -1
    };
  },
  componentDidMount: function(){
    var self = this;
    postal.subscribe({
      channel: "sys",
      topic: "choose",
      callback: function(data, envelope) {
        self.setState(data);
      }
    });
    postal.subscribe({
      channel: "now-message",
      topic: "new",
      callback: function(data, envelope) {
        self.forceUpdate(function(){
          var box = $('.ConvBox')[0];
          box.scrollTop = box.scrollHeight + 1000;
        });
      }
     });
  },
  render: function() {
    return (
      <div className="ConvMain">
        <ConvHeader withid={this.state.id} withtype={this.state.type} withname={this.state.name} />
        <ConvBox msgs={this.state.msgs} />
        <ConvInput send={this.send} />
      </div>
    );
  },
  send: function(msg){
    var self = this;
    var msg = {
      to:{
        id: self.state.id,
        type: self.state.type
      },
      content: msg,
      ts: new Date().getTime()
    }
    postal.publish({
      channel:"message",
      topic:"send",
      data: msg
    });
    self.state.msgs.push(msg);
    self.forceUpdate(function(){
      var box = $('.ConvBox')[0];
      box.scrollTop = box.scrollHeight + 1000;
    });
  }
});

var ConvHeader = React.createClass({
  getInitialState: function(){
    return {msgs:[]};
  },
  componentDidMount: function() {
  },
  render: function(){
    if (this.props.withtype == "friends"){
      return (
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">Chat With: {this.props.withname}</a>
            </div>

            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="icon-align-justify icon-x"></i></a>
                  <ul className="dropdown-menu">
                    <li><a href="#" onClick={this.deletefriend}>解除好友关系</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      );
    }else if(this.props.withtype == "groups") {
      return (
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">Group: {this.props.withname}</a>
            </div>

            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="icon-align-justify icon-x"></i></a>
                  <ul className="dropdown-menu">
                    <li><a href="#" onClick={this.addmember}>增加成员</a></li>
                    <li><a href="#" onClick={this.rmmember}>剔除成员</a></li>
                    <li><a href="#" onClick={this.destorygroup}>解散群组</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <AddMemeber id={this.props.withid} type="groups" />
          <RmMemeber id={this.props.withid} type="groups" />
        </nav>
      );
    }else {
      return (
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">Room: {this.props.withname}</a>
            </div>

            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="icon-align-justify icon-x"></i></a>
                  <ul className="dropdown-menu">
                    <li><a href="#" onClick={this.addmember}>增加成员</a></li>
                    <li><a href="#" onClick={this.rmmember}>剔除成员</a></li>
                    <li><a href="#" onClick={this.destoryroom}>解散聊天室</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <AddMemeber id={this.props.withid} type="rooms" />
          <RmMemeber id={this.props.withid} type="rooms" />
        </nav>
      );
    }

  },
  addmember: function(){
    $("#AddMemeber").modal("show");
  },
  rmmember: function(){
    $("#RmMemeber").modal("show");
  },
  destorygroup: function(){
    postal.publish({
      channel:"sys",
      topic:"group.destory",
      data: {
        id: this.props.withid
      }
    });
  },
  destoryroom: function(){
    postal.publish({
      channel:"sys",
      topic:"room.destory",
      data: {
        id: this.props.withid
      }
    });
  },
  deletefriend: function(){
    postal.publish({
      channel:"sys",
      topic:"friend.delete",
      data: {
        id: this.props.withid
      }
    });
  }
});

var ConvBox = React.createClass({
  getInitialState: function(){
    return {msgs:[]};
  },
  componentDidMount: function() {
  },
  render: function(){
    var msgs = this.props.msgs.map(function(msg){
      return (
        <ConvMsg msg={msg} key={msg.ts} />
      );
    })
    return (
      <div className="ConvBox" onScroll={this.handelScroll}>
        {msgs}
      </div>
    );
  }
});

var ConvMsg = React.createClass({
  render:function() {
    var className = "";
    var who = "";
    if(this.props.msg.from != undefined){
      className = "ConvMsg other";
      who = this.props.msg.from.id;
    }else{
      className = "ConvMsg me";
      who = "You";
    }
    if (this.props.msg.content.media == 0){
      return (
        <div className={className} >
        {who} Say: {this.props.msg.content.body}
        </div>
      );
    }else{
      return (
        <div className={className} >
        {who} Say:
        </div>
      );
    }

  }
})

var ConvInput = React.createClass({
  getInitialState: function() {
     return {
       body:"",
       media:0
     };
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var body = this.state;
    this.props.send(body);
    this.setState({body:"", media:0});
  },
  handleUpload: function(e) {
    $("#addfile").trigger('click');
  },
  handleInputChange: function(e){
    this.setState({body:e.target.value});
  },
  handleFile: function(e) {
    var form = new FormData();
    form.append("attachment", e.target.files[0]);
    this.props.send({
      media: 1,
      body: form
    })
  },
  render: function(){
    return (
      <div className="ConvInput">
        <div className="input-group">
          <span className="input-group-btn">
          <input type="file" onClick={this.handleFile} id="addfile" className="hide"/>
          <button className="btn btn-default" type="button" onClick={this.handleUpload} ><i className="icon-plus"></i></button>
          </span>
          <input type="text" className="form-control" placeholder="Say something..." value={this.state.body}
          onChange={this.handleInputChange} />
          <span className="input-group-btn">
            <button className="btn btn-default" type="button" onClick={this.handleSubmit} >Send</button>
          </span>
        </div>
      </div>
    );
  }
});

 App.start();
