/**
 * hideNavbar 组件
 * @description  滚动隐藏导航
 */
$.fn.IUI({
    hideNavbar: function(options) {


        var $this = this;

        var $navbar = $(".navbar");

        var height = $navbar.outerHeight() / 2;

        var hideNavbar = this.hasClass('hide-navbar-on-scroll');

        var previousScroll, currentScroll, scrollHeight, offsetHeight, reachEnd, action, navbarHidden, direction, wait;

        if (!hideNavbar && !$navbar.length) {
            return false;
        }


        previousScroll = currentScroll = Math.abs($this.scrollTop());

        wait = common.throttle(handleScroll, 100);

        $this.on('scroll', wait);


        function handleScroll(event) {
            currentScroll = $this.scrollTop();

            scrollHeight = this.scrollHeight;

            offsetHeight = this.offsetHeight;

            navbarHidden = $navbar.hasClass('navbar-hidden');
            //direction : true => up
            direction = previousScroll <= currentScroll;

            previousScroll = currentScroll;


            if (currentScroll < height || previousScroll > currentScroll) {
                behavior(false);
                return false;
            }

            // //reachEnd : true => 滚动条到底部
            // reachEnd = currentScroll + offsetHeight >= scrollHeight - 20;

            behavior(direction);



            return false;
        }

        function behavior(direction) {
            var _direction = direction;

            //_direction => hide
            if (_direction) {
                if ($navbar.hasClass('navbar-hidden')) {
                    return false;
                }
                $navbar.addClass('navbar-hidden');
            } else {

                if (!$navbar.hasClass('navbar-hidden')) {
                    return false;
                }

                $navbar.removeClass('navbar-hidden');
            }

        }
    }
});
