// JavaScript Document
$(function() {

    $('input[type="text"]').placeholder();

    var isIE = document.all && !window.atob;


    var animateEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        animateStart = 'webkitAnimationStart mozAnimationStart MSAnimationStart oanimationStart animationStart';
    //动态添加点赞人数
    var activity_id = $('input[name=activity_id]').val();
    var $zan = $(".dianzan span");
    var staticNum = [2800, 2100, 2000, 2600];
    $.ajax({
        data: "activity_id=" + activity_id + "&group=dianzan",
        dataType: 'json',
        timeout: 3000,
        url: "/ajax/group.html",
        type: 'POST',
        success: function(data, textStatus) {
            if (data.status) {
                $zan.each(function(index, el) {
                    var datas = data.count[index + 1] ? data.count[index + 1] : 0;
                    $(this).text(Number(datas) + staticNum[index]);
                });
            } else {}
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {}

    });
    //点赞
    var $li = $(".dianzan li");
    var $a = $(".dianzan a");
    var current_index;
    $li.on('click', function(event) {
        var $this = $(this),
            _index = $li.index($this) + 1,
            $img = $this.find('img');
        var $clickA = $this.find('a');

        $this.find('img').addClass('zoomIn');


        if (isIE) {
            /*--小于ie9--*/
            animate($a, $clickA);
        } else {
            /*--大于ie9或不是ie--*/
            $img.one(animateEnd, function(event) {
                animate($a, $clickA);
            })
        }
        $("#dianzan").val(_index);
        setTimeout(function() {
            $('body,html').animate({
                // scrollTop: 521
                scrollTop:$('.content').offset().top-150
            }, 800);
        }, 1000);

    });

    function animate(a, obj) {
        a.removeClass('current');
        obj.addClass('current');
        obj.find('img').removeClass('zoomIn');
    }

    //性别
    $('body').on('click', '.sex_radio', function (event) {
        var $this = $(this);
        var _index = $('body').find('.sex_radio').index($this)+1;
        $('body').find('.sex_radio').removeClass('current');
        $('body').find('#gender').val(_index);
        $this.addClass('current');
    });

    //赠险
    $('body').on('change', '.genre-radio', function (event) {
        $('body').find('.genre-radio').find('input').prop('checked', false);
        $(this).find('input').prop('checked', true);
    });

    var nowDate = new Date(),
        year = nowDate.getFullYear() + "",
        month = nowDate.getMonth() + 1 + "",
        day = nowDate.getDate() + "",
        agemax = (year - 25) + "-" + month + "-" + day,
        agemin = (year - 50) + "-" + month + "-" + day,
        agedefult = (year - 31) + "-" + month + "-" + day;
    //生日
    laydate({
        elem: '#J_datePicker',
        event: 'focus',
        min: agemin,
        max: agemax,
        start: agedefult
    });
    // $('#J_datePicker').on('focus', function() {
    //     $.tip({
    //         text: '为了确保您能成功领取赠险，请准确填写出生日期'
    //     });
    // });
    // $('#J_sp').on('focus', function() {
    //     $.tip({
    //         text: '请正确填写工作地或居住地，如在活动范围内可成功领取赠险'
    //     });
    // });

    var jsonData  = [{"name":"上海市","value":"上海市",
                      "city":[{"name":"上海市","value":"上海市","code":"021"}]
                     },
                     {"name":"江苏省","value":"江苏省",
                      "city":[{"name":"南京市","value":"南京市","code":"025"}]
                     },
                     {"name":"湖北省","value":"湖北省",
                      "city":[{"name":"武汉市","value":"武汉市","code":"027"},
                                {"name":"宜昌市","value":"宜昌市","code":"0717"},
                                {"name":"襄樊市","value":"襄樊市","code":"0710"},
                                {"name":"荆门市","value":"荆门市","code":"0724"}]
                     },
                     {"name":"山东省","value":"山东省",
                      "city":[{"name":"青岛市","value":"青岛市","code":"0532"},
                              {"name":"济南市","value":"济南市","code":"0531"},
                              {"name":"烟台市","value":"烟台市","code":"0535"}
                             ]
                     },
                     {"name":"四川省","value":"四川省",
                      "city":[{"name":"成都市","value":"成都市","code":"028"},
                              {"name":"自贡市","value":"自贡市","code":"0813"},
                              {"name":"攀枝花市","value":"攀枝花市","code":"0812"},
                              {"name":"泸州市","value":"泸州市","code":"0830"},
                              {"name":"德阳市","value":"德阳市","code":"0838"},
                              {"name":"绵阳市","value":"绵阳市","code":"0816"},
                              {"name":"广元市","value":"广元市","code":"0839"},
                              {"name":"遂宁市","value":"遂宁市","code":"0825"},
                              {"name":"内江市","value":"内江市","code":"0832"},
                              {"name":"乐山市","value":"乐山市","code":"0833"},
                              {"name":"南充市","value":"南充市","code":"0817"},
                              {"name":"眉山市","value":"眉山市","code":"028"},
                              {"name":"宜宾市","value":"宜宾市","code":"0831"},
                              {"name":"广安市","value":"广安市","code":"0826"},
                              {"name":"达州市","value":"达州市","code":"0818"},
                              {"name":"雅安市","value":"雅安市","code":"0835"},
                              {"name":"巴中市","value":"巴中市","code":"0827"},
                              {"name":"资阳市","value":"资阳市","code":"028"},
                              {"name":"阿坝藏族羌族自治州","value":"阿坝藏族羌族自治州","code":"0837"},
                              {"name":"甘孜藏族自治州","value":"甘孜藏族自治州","code":"0836"},
                              {"name":"凉山彝族自治州","value":"凉山彝族自治州","code":"0834"}
                             ]
                     }];

    //城市下拉
    $('.city_context').cityselector({
        dataJson: jsonData,
        level: 2,
        value: true,
        onChangeOne: function(obj) {
            var value=jsonData[$('#liProvince>li.checked').index()].city[$('#liCity>li.checked').index()].code;
            $("#quhao").val(value);
        },
        onChangeTwo: function(obj) {
            var value=jsonData[$('#liProvince>li.checked').index()].city[$('#liCity>li.checked').index()].code;
            $("#quhao").val(value);
        }
    });


    // //类型下拉
    try{
        var genre_json = [{"name":"10万元公共交通意外保障","value":"10万元公共交通意外保障"},{"name":"10万元自驾意外保障","value":"10万元自驾意外保障"}];
        $('.genre_context').cityselector({
            dataJson: genre_json,
            level: 1,
            value: true
        });
    }catch(e){console.log(e)};

    /*黑名单名字验证*/
    var userNameStr = "妈,尼玛,泥妈,呢码,妮马,尼马,泥马,操你,卧槽,曹旎,曹你,曹尼,屌丝,他妈,贱,老子,劳资,煞笔,王八,什么,猪,鸡,鸭,呵呵,啊啊,阿阿,脑残,垃圾,麻痹,阿斯顿,阿斯达,阿斯大,奥巴马,士大夫,打飞机,爸,爷,妈逼,你猜,你爹,你管我,你妹,知道,奥特曼,大叔,屎,尿,屁,死,一坨,傻,骗,八嘎,是片子,变态,操你,毛泽东,周恩来,朱德,邓小平,江泽民,胡锦涛,温家宝,习近平,测试";

    var userNameJson = userNameStr.split(",");
    $(".name").on('blur', function(event) {
        nameCheck($(this));
    });

    function nameCheck(obj) {
        var userName = obj.val();
        for (var i = 0; i < userNameJson.length; i++) {
            var jsonRet = userName.match(userNameJson[i]);
            if (jsonRet) {
                var tips = '姓名不能出现' + userNameJson[i];
                $.tip({
                    text: tips
                });
                return false;
            }
        }
    }

    //邮箱自动补全
    $("#email").mailAutoComplete({
        email: ["qq.com", "126.com", "163.com", "gmail.com", "sohu.com", "sina.com", "vip.qq.com", "21cn.com"]
    });

    $("#email").on('focus', function(event) {
        var $m_width = $("#email").outerWidth() - 2;
        var $top = $("#email").offset().top + $("#email").outerHeight() - 1;
        var $left = $("#email").offset().left;
        $('.emailist').css({
            'min-width': $m_width,
            'top': $top,
            'left': $left
        });
    });

    //邮箱城市同时点击"bug"
    $('#email').on('focus', function() {
        $('.emailist').removeClass('none');
    });
    $('.selector_name').on('click', function() {
        $('.emailist').addClass('none');
    });
    // $("input").focus(function(){
    //      $(document.body).css("overflow-y","hidden");
    // });
    // $("input").blur(function(){
    //      $(document.body).css("overflow-y","scroll");
    // });
    // $('.city').click(function(){
    //     var $this=$(this);
    //     if($this.hasClass('active')){$(document.body).css("overflow-y","hidden");}
    // });
    // $(document).click(function(){
    //     $(document.body).css("overflow-y","scroll");
    // })
    // $(".selector_list").on('click','li',function(){
    //     $(document.body).css("overflow-y","scroll");
    // });

    //验证表单
    //var bs=0;
    $require = $("*[data-require]");
    var type = ['姓名', '手机', '邮箱'];
    var rel = ['/^[\u4e00-\u9fa5]{2,}$/', '/^1[3|4|5|6|7|8][0-9]([0-9]){8}$/', '/^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+[.][.a-zA-Z]+$/'];
    var texts = ["姓名必须为中文！", "手机号码格式不正确！", "邮箱格式不正确！"];
    $require.on('blur.abc', function(event) {
        $this = $(this);
        var options = $this.attr('data-require');
        var value = $this.val();
        var index = $require.index($this);
        var re = rel[index];
        re = strToJson(re);
        var times = 0;
        if (options) {
            if (!value) {
                var tips = type[index] + '不能为空！';
                $.tip({
                    text: tips
                });
                return false;
            }
            if (!re.test(value) && (index != 2)) {
                var tips = texts[index];
                $.tip({
                    text: tips
                });
            }
            // else if(index==1){
            //     var btnSubmit=$('.submit_btn');
            //     btnSubmit.off('click',jsubmit );
            //     $.get('/json/phone.html?phone='+value,{},function(data){
            //         $('#quhao').val(data.AreaCode);
            //         btnSubmit.on('click',jsubmit );
            //         if (bs==1) {
            //             bs=0;
            //             btnSubmit.click();
            //         };
            //     })
            // }
        }
    });
    //提交表单
    $('#J_form').on('submit', function (event) {
        event.preventDefault();
        var $this = $(this);
        $this.find('.submit_btn').html('<img src="/Public/images/loading.gif" class="loading" alt="" width="25" height="25">');
        $.ajaxForm($this).then(function(data) {
            var result = data.status ? true : false;
            $this.data('limit', 0);
            $this.find('.submit_btn').html('');
            if (data.status === 1) {
                $this.layer({
                    url: data.url
                });
                // document.getElementById("J_form").reset();

            };
            $.tip({
                text: data.info,
                status: result
            });
        }, function(err) {
            $this.data('limit', 0);
        });
    });
    // $('.submit_btn').on('mousedown',function(e){
    //     e.stopPropagation();
    //     bs=1;
    // });
    //  $(document).mousedown(function(){
    //     bs=0;
    // });
    //选项卡切换
    var $tab = $(".tab_nav a"),
        $tab_main = $(".tab_main"),
        speed = 300;
    $(".current span").show();
    $tab.hover(function() {
        $this = $(this);

        var _width = $(".tab_relative").width();
        var _left = -($this.parents("ul").find('a').index($this)) * _width;
        $tab_main.stop().animate({
            left: _left
        }, speed);
        $tab.removeClass('current');
        $this.addClass('current');
        $tab.find('span').hide();
        $this.find('span').show();
    });

    $.extend({
        tip: function(options) {

            var param = $.extend({
                obj: "#message",
                text: '',
                timeout: 5000,
                status: true
            }, options);

            var obj = param.obj instanceof $ ? param.obj : $(param.obj);

            var count = obj.data('count') || 1;

            var status = param.status ? 'success' : 'error';

            clearTimeout(obj.data('count'));

            obj.html('<span class="' + status + '">' + param.text + '</span>');
            var objW = '-' + obj.outerWidth() * 0.5 + 'px';
            obj.css({
                left: '50%',
                'margin-left': objW
            });
            obj.removeClass('none');
            obj.data('count', setTimeout(function() {

                obj.addClass('none');

            }, param.timeout));
        },
        ajaxForm: function(form) {

            var $this = form instanceof $ ? form : $(form);

            if (!$this.data('limit')) {
                $this.data('limit', 1);
                return $.ajax({
                    url: $this.attr('action'),
                    //url:'/pkufi_1.html' ,
                    type: 'POST',
                    dataType: 'json',
                    data: $this.serialize()
                });
            }
        }
    });

});

function strToJson(str) {
    if (str == '' || typeof(str) == 'object') {
        return str;
    }
    var json = eval('(' + str + ')');
    return json;
}
