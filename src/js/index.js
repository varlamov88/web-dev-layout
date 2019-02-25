import "jquery";
import "jquery-validation";
import 'owl.carousel';
import "../scss/style.scss";

$(document).ready(function(){
	$('.owl-carousel').owlCarousel({
		items: 1,
		margin: 30,
		loop: true,
		responsiveClass:true,
		responsive:{
			600:{
				items: 2
			},
			1200:{
				items: 3
			}
		}
	});

	$('.scrollTo').on('click', function() {
		let elementClick = $(this).attr("href") || $(this).attr("data-href");
		if($(elementClick) && elementClick.length > 1) {
			let destination = $(elementClick).offset().top;
			$('html,body').animate( { scrollTop: destination }, 1100 );
			return false;
		}
	});

	$("#contacts__form").validate({
		rules: {
			name: "required",
			email: {
				required: true,
				email: true
			}
		},
		errorPlacement: function() {
			return;
		},
		submitHandler: function(form) {
			$(form).find('.form__success-message').addClass('show');
			$(form).find('.form__inner').hide();
			//form.submit();
		}
	});
});

 