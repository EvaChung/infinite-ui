/**
 * share 分享组件
 */
module.exports = {
    share: function(options) {
        var param = $.extend({
            title: null,                //分享的标题
            summary: null,              //分享的简介
            url: null,                  //分享url地址
            pic: $('body').find('img').eq(0).attr('src'),    //分享的图片，默认拿第一张图片
            copybtn: '#copy-url',       //复制按钮
            swbbtn: '.sweibo',          //新浪微博按钮
            qzonebtn: '.qzone',         //QQ空间按钮
            twbbtn: '.tweibo',          //腾讯微博按钮
            dbbtn: '.douban',           //豆瓣按钮
            rrbtn: '.renren'            //人人网按钮
        }, options);
        var title = encodeURIComponent(param.title);
        var summary = encodeURIComponent(param.summary);
        var pic = encodeURIComponent(document.domain+param.pic);
        var weiboUrl = encodeURIComponent(param.url + '&share=weibo');
        weiboUrl = 'http://service.weibo.com/share/share.php?url=' + weiboUrl + '&title=' + title + '&pic=' + pic + '&appkey=&searchPic=false';
        $(param.swbbtn).attr('href', weiboUrl);
        var qzoneUrl = encodeURIComponent(param.url + '&share=qzone');
        qzoneUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + qzoneUrl + '#qzone&title=' + title + '&summary='+ summary +'&pics=' + pic;
        $(param.qzonebtn).attr('href', qzoneUrl);
        var tweiboUrl = encodeURIComponent(param.url + '&share=tweibo');
        tweiboUrl = 'http://share.v.t.qq.com/index.php?c=share&a=index&url=' + tweiboUrl + '#tweibo&appkey=appkey&title=' + summary + '&pic=' + pic;
        $(param.twbbtn).attr('href', tweiboUrl);
        var doubanUrl = encodeURIComponent(param.url + '&share=douban');
        doubanUrl = 'http://www.douban.com/share/service?image=' + pic + '&href=' + doubanUrl + '#douban&name=' + title + '&text=' + summary;
        $(param.dbbtn).attr('href', doubanUrl);
        var renrenUrl = encodeURIComponent(param.url + '&share=renren');
        renrenUrl = 'http://widget.renren.com/dialog/share?resourceUrl=' + renrenUrl + '&srcUrl=' + renrenUrl + '&title=' + title + '&pic=' + pic + '&description=' + summary;
        $(param.rrbtn).attr('href', renrenUrl);
        $(param.copybtn).val(param.url + '&share=copy');
    }
};
