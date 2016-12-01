(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./session", "../helper/md5"], factory);
    }
})(function (require, exports) {
    "use strict";
    var session_1 = require("./session");
    var md5_1 = require("../helper/md5");
    var LoginImpl = (function () {
        function LoginImpl(apiOptions) {
            this._options = apiOptions;
            var foo = new Date().getTime();
            var bar = md5_1.md5("" + foo + this._options.sign) + ',' + foo;
            this._basicAuth = {
                app: this._options.app,
                sign: bar
            };
        }
        LoginImpl._extend = function (target, source) {
            for (var k in source) {
                target[k] = source[k];
            }
        };
        LoginImpl.prototype.simple = function (userid) {
            var authdata = {
                client: userid
            };
            LoginImpl._extend(authdata, this._basicAuth);
            return new session_1.SessionBuilderImpl(this._options, authdata);
        };
        LoginImpl.prototype.byMaxleapUser = function (username, password) {
            var authdata = {
                username: username,
                password: password
            };
            LoginImpl._extend(authdata, this._basicAuth);
            return new session_1.SessionBuilderImpl(this._options, authdata);
        };
        LoginImpl.prototype.byPhone = function (phone, verify) {
            var authdata = {
                phone: phone,
                password: verify
            };
            LoginImpl._extend(authdata, this._basicAuth);
            return new session_1.SessionBuilderImpl(this._options, authdata);
        };
        return LoginImpl;
    }());
    exports.LoginImpl = LoginImpl;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2aWNlL2xvZ2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQUFBLHdCQUFpRCxXQUFXLENBQUMsQ0FBQTtJQUU3RCxvQkFBa0IsZUFBZSxDQUFDLENBQUE7SUE0QmxDO1FBS0ksbUJBQVksVUFBc0I7WUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7WUFDM0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMvQixJQUFJLEdBQUcsR0FBRyxTQUFHLENBQUMsS0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQ3pELElBQUksQ0FBQyxVQUFVLEdBQUc7Z0JBQ2QsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRztnQkFDdEIsSUFBSSxFQUFFLEdBQUc7YUFDWixDQUFBO1FBQ0wsQ0FBQztRQUVjLGlCQUFPLEdBQXRCLFVBQXVCLE1BQVUsRUFBRSxNQUFVO1lBQ3pDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsQ0FBQztRQUNMLENBQUM7UUFFRCwwQkFBTSxHQUFOLFVBQU8sTUFBYztZQUNqQixJQUFJLFFBQVEsR0FBRztnQkFDWCxNQUFNLEVBQUUsTUFBTTthQUNqQixDQUFDO1lBQ0YsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxJQUFJLDRCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUVELGlDQUFhLEdBQWIsVUFBYyxRQUFnQixFQUFFLFFBQWdCO1lBQzVDLElBQUksUUFBUSxHQUFHO2dCQUNYLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsUUFBUTthQUNyQixDQUFDO1lBQ0YsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxJQUFJLDRCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUVELDJCQUFPLEdBQVAsVUFBUSxLQUFhLEVBQUUsTUFBYztZQUNqQyxJQUFJLFFBQVEsR0FBRztnQkFDWCxLQUFLLEVBQUUsS0FBSztnQkFDWixRQUFRLEVBQUUsTUFBTTthQUNuQixDQUFDO1lBQ0YsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxJQUFJLDRCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUNMLGdCQUFDO0lBQUQsQ0E5Q0EsQUE4Q0MsSUFBQTtJQTlDWSxpQkFBUyxZQThDckIsQ0FBQSIsImZpbGUiOiJzZXJ2aWNlL2xvZ2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTZXNzaW9uQnVpbGRlciwgU2Vzc2lvbkJ1aWxkZXJJbXBsfSBmcm9tIFwiLi9zZXNzaW9uXCI7XG5pbXBvcnQge0FQSU9wdGlvbnN9IGZyb20gXCIuLi9tb2RlbC9tb2RlbHNcIjtcbmltcG9ydCB7bWQ1fSBmcm9tIFwiLi4vaGVscGVyL21kNVwiO1xuXG4vKipcbiAqIOeZu+W9leWZqFxuICovXG5leHBvcnQgaW50ZXJmYWNlIExvZ2luIHtcbiAgICAvKipcbiAgICAgKiDmnoHnroDnmbvlvZVcbiAgICAgKiBAcGFyYW0gdXNlcmlkIOeUqOaIt0lEXG4gICAgICovXG4gICAgc2ltcGxlKHVzZXJpZDogc3RyaW5nKTogU2Vzc2lvbkJ1aWxkZXI7XG4gICAgLyoqXG4gICAgICog6YCa6L+HTWF4TGVhcOeUqOaIt+i0puWPt+eZu+W9lVxuICAgICAqIEBwYXJhbSB1c2VybmFtZSDnlKjmiLflkI1cbiAgICAgKiBAcGFyYW0gcGFzc3dvcmQg5a+G56CBXG4gICAgICovXG4gICAgYnlNYXhsZWFwVXNlcih1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogU2Vzc2lvbkJ1aWxkZXI7XG4gICAgLyoqXG4gICAgICog6YCa6L+H5omL5py65Y+355m75b2VXG4gICAgICogQHBhcmFtIHBob25lIOaJi+acuuWPt+eggVxuICAgICAqIEBwYXJhbSB2ZXJpZnkg6aqM6K+B56CBXG4gICAgICovXG4gICAgYnlQaG9uZShwaG9uZTogc3RyaW5nLCB2ZXJpZnk6IHN0cmluZyk6IFNlc3Npb25CdWlsZGVyO1xufVxuXG4vKipcbiAqIOeZu+W9leWZqOWunueOsOexu1xuICovXG5leHBvcnQgY2xhc3MgTG9naW5JbXBsIGltcGxlbWVudHMgTG9naW4ge1xuXG4gICAgcHJpdmF0ZSBfb3B0aW9uczogQVBJT3B0aW9ucztcbiAgICBwcml2YXRlIF9iYXNpY0F1dGg6IHt9O1xuXG4gICAgY29uc3RydWN0b3IoYXBpT3B0aW9uczogQVBJT3B0aW9ucykge1xuICAgICAgICB0aGlzLl9vcHRpb25zID0gYXBpT3B0aW9ucztcbiAgICAgICAgbGV0IGZvbyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBsZXQgYmFyID0gbWQ1KGAke2Zvb30ke3RoaXMuX29wdGlvbnMuc2lnbn1gKSArICcsJyArIGZvbztcbiAgICAgICAgdGhpcy5fYmFzaWNBdXRoID0ge1xuICAgICAgICAgICAgYXBwOiB0aGlzLl9vcHRpb25zLmFwcCxcbiAgICAgICAgICAgIHNpZ246IGJhclxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2V4dGVuZCh0YXJnZXQ6IHt9LCBzb3VyY2U6IHt9KTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGsgaW4gc291cmNlKSB7XG4gICAgICAgICAgICB0YXJnZXRba10gPSBzb3VyY2Vba107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaW1wbGUodXNlcmlkOiBzdHJpbmcpOiBTZXNzaW9uQnVpbGRlciB7XG4gICAgICAgIGxldCBhdXRoZGF0YSA9IHtcbiAgICAgICAgICAgIGNsaWVudDogdXNlcmlkXG4gICAgICAgIH07XG4gICAgICAgIExvZ2luSW1wbC5fZXh0ZW5kKGF1dGhkYXRhLCB0aGlzLl9iYXNpY0F1dGgpO1xuICAgICAgICByZXR1cm4gbmV3IFNlc3Npb25CdWlsZGVySW1wbCh0aGlzLl9vcHRpb25zLCBhdXRoZGF0YSk7XG4gICAgfVxuXG4gICAgYnlNYXhsZWFwVXNlcih1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogU2Vzc2lvbkJ1aWxkZXIge1xuICAgICAgICBsZXQgYXV0aGRhdGEgPSB7XG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgfTtcbiAgICAgICAgTG9naW5JbXBsLl9leHRlbmQoYXV0aGRhdGEsIHRoaXMuX2Jhc2ljQXV0aCk7XG4gICAgICAgIHJldHVybiBuZXcgU2Vzc2lvbkJ1aWxkZXJJbXBsKHRoaXMuX29wdGlvbnMsIGF1dGhkYXRhKTtcbiAgICB9XG5cbiAgICBieVBob25lKHBob25lOiBzdHJpbmcsIHZlcmlmeTogc3RyaW5nKTogU2Vzc2lvbkJ1aWxkZXIge1xuICAgICAgICBsZXQgYXV0aGRhdGEgPSB7XG4gICAgICAgICAgICBwaG9uZTogcGhvbmUsXG4gICAgICAgICAgICBwYXNzd29yZDogdmVyaWZ5XG4gICAgICAgIH07XG4gICAgICAgIExvZ2luSW1wbC5fZXh0ZW5kKGF1dGhkYXRhLCB0aGlzLl9iYXNpY0F1dGgpO1xuICAgICAgICByZXR1cm4gbmV3IFNlc3Npb25CdWlsZGVySW1wbCh0aGlzLl9vcHRpb25zLCBhdXRoZGF0YSk7XG4gICAgfVxufSJdfQ==
