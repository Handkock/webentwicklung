$(document).ready(function(){
	$(".delete-form").submit( function(eventObj) {
			const id = $(".delete-session").attr("data-id");
			$.ajax({
				type: 'DELETE',
				url: '/deleteSession/' + id,
				success: function (response){					
					return false;
				},
				error: function(err){
				  console.error(err);
				}
			});
	});
});