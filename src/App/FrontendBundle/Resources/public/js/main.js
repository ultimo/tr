$('#home').animate({'height':$(window).height()-60}, 0, function() {
	$('.page-header').animate({'opacity':1}, 500);
});

$('#toolbelt li').popover({placement: 'bottom', trigger: 'click'}).click(function() {
	$(this).siblings().popover('hide');
});

$('#skills .bar').width(0);

$('#skills').waypoint(function(direction) {
	if (direction == 'down') {
		$('#skills .bar').width(function(){
			$(this).width($(this).attr('data-width')+'%');
		});
	}
}, {offset: '70%'});
