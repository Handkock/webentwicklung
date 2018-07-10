$(document).ready(function () {
	$(".delete-form").submit(function () {
		const id = $(".delete-session").attr("data-id");
		$.ajax({
			type: "DELETE",
			url: "/deleteSession/" + id,
			success: function () {
				return false;
			},
			error: function (err) {
				console.error(err);
			}
		});
	});

	$(".session-obj").on("click", function () {
		let tmp = $(this).attr("data-id");
		let id = tmp.split("-")[1];
		var url = "/view/" + id;
		$(location).attr("href", url);
	});
});
