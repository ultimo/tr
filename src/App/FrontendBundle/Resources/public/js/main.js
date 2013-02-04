$(document).ready(function() {
    var setHomeHeight = function() {
            $('#home').animate({
                'height': $(window).height() - 60
            }, 0);
        };

    setHomeHeight(true);
    setTimeout(function() {
        $('.page-header').addClass('trigger');
    }, 1000);

    $(window).resize(function(argument) {
        setHomeHeight(false);
    });

    $('nav a').smoothScroll();

    $('#toolbelt li').popover({
        placement: 'bottom',
        trigger: 'click'
    }).click(function() {
        $(this).siblings().popover('hide');
    });

    $('#about').waypoint(function(direction) {
        if(direction == 'down') {
            $('#about h2').addClass('trigger');
        }
    }, {
        offset: '80%'
    });

    $('#skills .bar').width(0);
    $('#skills').waypoint(function(direction) {
        if(direction == 'down') {
            $('#skills .bar').width(function() {
                $(this).width($(this).attr('data-width') + '%');
            });
        }
    }, {
        offset: '60%'
    });

    $('#toolbelt').waypoint(function(direction) {
        if(direction == 'down') {
            $('#toolbelt ul').addClass('trigger');
        }
    }, {
        offset: '60%'
    });
});