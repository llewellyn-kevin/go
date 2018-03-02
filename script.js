$(document).ready(function() {
	$('#rules-link').click(function() {
		$('#rules-link').attr('class', 'hidden');
		$('#front-link').attr('class', '');
		
		$('#front').fadeOut(300, function() {
			$('#rules').fadeIn(300);
		});
	});
	$('#front-link').click(function() {
		$('#front-link').attr('class', 'hidden');
		$('#rules-link').attr('class', '');
		
		$('#rules').fadeOut(300, function() {
			$('#front').fadeIn(300);
		});
	});

});
