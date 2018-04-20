"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define(["../model/log_entry"], function (LogEntry) {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout(),
            model = function () {
                return frame.model();
            },
            client = function (id) {
                return frame.model().clients.find(id);
            },
            node = function (id) {
                return frame.model().nodes.find(id);
            },
            wait = function () {
                var self = this;
                model().controls.show(function () {
                    player.play();
                    self.stop();
                });
            };

        frame.after(1, function () {
            model().nodeLabelVisible = false;
            model().clear();
            model().nodes.create("a");
            model().nodes.create("b");
            model().nodes.create("c");
            layout.invalidate();
        })

            .after(800, function () {
                model().subtitle =
                    '<h2><em>Raft</em> is a protocol for implementing distributed consensus.</h2>'
                    + '<h2>而<em>Raft</em> 就是实现了分布式一致性的算法</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                model().subtitle =
                    '<h2>Let\'s look at a high level overview of how it works.</h2>'
                    + '<h2>接下来我们了解一下它是怎样工作的</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()


            .after(100, function () {
                frame.snapshot();
                model().zoom([node("b")]);
                model().subtitle =
                    '<h2>A node can be in 1 of 3 states:</h2>'
                    + '<h2>一个节点一般可能存在1到3种角色状态:</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                node("b")._state = "follower";
                model().subtitle =
                    '<h2>The <em>Follower</em> state,</h2>'
                    + '<h2><em>跟随者</em> 角色,</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                node("b")._state = "candidate";
                model().subtitle =
                    '<h2>the <em>Candidate</em> state,</h2>'
                    + '<h2> <em>候选人</em> 角色，</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                node("b")._state = "leader";
                model().subtitle =
                    '<h2>or the <em>Leader</em> state.</h2>'
                    + '<h2>或者 <em>领导者</em> 角色。</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(300, function () {
                frame.snapshot();
                model().zoom(null);
                node("b")._state = "follower";
                model().subtitle =
                    '<h2>All our nodes start in the follower state.</h2>'
                    + '<h2>一开始，所有的节点都是跟随者</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                model().subtitle =
                    '<h2>If followers don\'t hear from a leader then they can become a candidate.</h2>'
                    + '<h2>如果一段时间后，跟随者没有监听到领导者的消息，则自己将变成候选人身份</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, function () {
                node("a")._state = "candidate";
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                model().subtitle =
                    '<h2>The candidate then requests votes from other nodes.</h2>'
                    + '<h2>然后，候选人将向其它节点发起一次选举投票请求</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, function () {
                model().send(node("a"), node("b"), {type: "RVREQ"})
                model().send(node("a"), node("c"), {type: "RVREQ"})
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                model().subtitle =
                    '<h2>Nodes will reply with their vote.</h2>'
                    + '<h2>接收到的节点都会回复（响应）这次投票</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(300, function () {
                model().send(node("b"), node("a"), {type: "RVRSP"}, function () {
                    node("a")._state = "leader";
                    layout.invalidate();
                })
                model().send(node("c"), node("a"), {type: "RVRSP"}, function () {
                    node("a")._state = "leader";
                    layout.invalidate();
                })
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                model().subtitle =
                    '<h2>The candidate becomes the leader if it gets votes from a majority of nodes.</h2>'
                    + '<h2>如果大多数节点都投票赞同，那么这个候选人将成为"领导人"</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                model().subtitle =
                    '<h2>This process is called <em>Leader Election</em>.</h2>'
                    + '<h2>这个过程叫做 <em>领导人选举</em> </h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()


            .after(100, function () {
                frame.snapshot();
                model().subtitle =
                    '<h2>All changes to the system now go through the leader.</h2>'
                    + '<h2>现在，所有的变化都由这个领导人来决定</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                model().subtitle += " ";
                model().clients.create("x");
                layout.invalidate();
            })
            .after(1000, function () {
                client("x")._value = "5";
                layout.invalidate();
            })
            .after(500, function () {
                model().send(client("x"), node("a"), null, function () {
                    node("a")._log.push(new LogEntry(model(), 1, 1, "SET 5"));
                    layout.invalidate();
                });
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                model().subtitle =
                    '<h2>Each change is added as an entry in the node\'s log.</h2>'
                    + '<h2>每次更改都会记录到节点的日志里</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                model().subtitle =
                    '<h2>This log entry is currently uncommitted so it won\'t update the node\'s value.</h2>'
                    + '<h2>不过，这条记录还没有提交，所以还不会更改节点的值</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(300, function () {
                frame.snapshot();
                model().send(node("a"), node("b"), {type: "AEREQ"}, function () {
                    node("b")._log.push(new LogEntry(model(), 1, 1, "SET 5"));
                    layout.invalidate();
                });
                model().send(node("a"), node("c"), {type: "AEREQ"}, function () {
                    node("c")._log.push(new LogEntry(model(), 1, 1, "SET 5"));
                    layout.invalidate();
                });
                model().subtitle =
                    '<h2>To commit the entry the node first replicates it to the follower nodes...</h2>'
                    + '<h2>在提交之前，节点会先将这条通知并记录到跟随者节点...</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                model().send(node("b"), node("a"), {type: "AEREQ"}, function () {
                    node("a")._commitIndex = 1;
                    node("a")._value = "5";
                    layout.invalidate();
                });
                model().send(node("c"), node("a"), {type: "AEREQ"});
                model().subtitle =
                    '<h2>then the leader waits until a majority of nodes have written the entry.</h2>'
                    + '<h2>然后领导人进入等待状态知道大多数节点确认记录成功</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(1000, function () {
                node("a")._commitIndex = 1;
                node("a")._value = "5";
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                model().subtitle =
                    '<h2>The entry is now committed on the leader node and the node state is "5".</h2>'
                    + '<h2>此时，领导人将提交这条记录，当前值变为5</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                model().send(node("a"), node("b"), {type: "AEREQ"}, function () {
                    node("b")._value = "5";
                    node("b")._commitIndex = 1;
                    layout.invalidate();
                });
                model().send(node("a"), node("c"), {type: "AEREQ"}, function () {
                    node("c")._value = "5";
                    node("c")._commitIndex = 1;
                    layout.invalidate();
                });
                model().subtitle =
                    '<h2>The leader then notifies the followers that the entry is committed.</h2>'
                    + '<h2>然后领导人通知所有跟随者提交记录</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                model().subtitle =
                    '<h2>The cluster has now come to consensus about the system state.</h2>'
                    + '<h2>现在，集群状态已经达成一致了</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()


            .after(300, function () {
                frame.snapshot();
                model().subtitle =
                    '<h2>This process is called <em>Log Replication</em>.</h2>'
                    + '<h2>这个过程叫作 <em>日志复制</em>.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()


            .after(300, function () {
                frame.snapshot();
                player.next();
            })


        player.play();
    };
});
