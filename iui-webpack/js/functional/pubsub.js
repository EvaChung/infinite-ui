/**
 * pub_sub
 * 发布/订阅模式
 */
var o = $({});

module.exports = {
    sub: function() {
        o.on.apply(o, arguments);
    },
    unsub: function() {
        o.off.apply(o, arguments);
    },
    pub: function() {
        o.trigger.apply(o, arguments);
    }
};
