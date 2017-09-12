"use strict";

const assert = require("chai").assert;
const IM = require("../lib/im.js");
const config = {
    app: "56a86320e9db7300015438f7",
    key: "bWU4SS1uUEx6Z3lqeGwzMVdhRXVrZw",
    region: "test",
    useHttp: true
};

describe("#all", () => {
    it("#simple", (done) => {
        // login bar
        IM(config).login().simple("bar")
            .onFriendMessage((id, msg) => {
                console.log("message from friend %s: %s", id, msg.content.body);
                done();
            })
            .ok((err) => {
                if (err) {
                    console.error("login failed: %s", err);
                    done(err);
                    return;
                }
                console.log("----- login bar success. -----");
                // login foo
                IM(config).login().simple("foo")
                    .onAck((ack, ts) => {
                        console.log("rcv ack: ack=%d, ts=%d.", ack, ts);
                    })
                    .ok((err, session, context) => {
                        if (err) {
                            console.error("login failed: %s.", err);
                            done(err);
                            return;
                        }
                        console.log("----- login foo success. -----");
                        context.listFriends((err, friends) => {
                            if (err) {
                                console.error("get friends failed: %s.", err);
                                done(err);
                                return;
                            }
                            context.joinFriend("bar", (err) => {
                                if (err) {
                                    console.error("make friend failed: %s.", err);
                                    done(err);
                                    return;
                                }
                                let barOnline = false;
                                friends.forEach(friend => {
                                    console.log("%j", friend);
                                    if (friend.id === "bar") {
                                        barOnline = friend.online;
                                    }
                                });
                                assert.isOk(barOnline);
                                session.say("fuck you!").ack(12345).asText().toFriend("bar").ok()
                            });
                        });
                    });
            });
    }).timeout(5000)
});