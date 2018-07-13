var table;
var sessions;
var elementSize;
var sessionsPerPage;
var pages;
var currentPage;
var sessionCount;
var indexFirst;
var indexLast;
var pagingHeight;
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
window.onload = function () {
	sessionCount = 0;
	sessions = [];
	pages = 1;
	currentPage = 1;
	indexFirst = 0;
	indexLast = 0;
	table = document.getElementById("table");
	document.getElementById("back").onclick = function () {
		console.log(indexFirst);
		console.log(indexLast);
		if (currentPage > 1) {
			currentPage--;
			paginate();
		}
	};
	document.getElementById("next").onclick = function () {
		console.log(indexFirst);
		console.log(indexLast);
		if (currentPage < pages) {
			currentPage++;
			paginate();
		}
	};
	loadSessions();
	//leere table nehmen
	//pagination machen
	//table befüllen
};
window.onresize = function () {
	paginate(true);
};
function loadSessions() {
	var request = new XMLHttpRequest();
	request.open("GET", "/sessions", true);
	request.setRequestHeader("Content-Type", "application/json");
	request.send();
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {
			sessions = JSON.parse(request.responseText);
			paginate(true);
		}
	};
}
function paginate(resize = false) {
	sessionCount = sessions.length;
	if (resize) { //falls Größen neu berechnet werden müssen
		indexFirst = 0;
		indexLast = 0;
		fillTable([sessions[0]]);
		elementSize = table.rows[0].clientHeight;
		var rect = table.getBoundingClientRect();
		pagingHeight = document.getElementById("paging").clientHeight;
		let headHeight = document.getElementById("head").clientHeight;
		var tableheight = window.innerHeight - rect.top - pagingHeight - headHeight;
		sessionsPerPage = Math.floor(tableheight / elementSize);
		pages = Math.ceil(sessionCount / sessionsPerPage);
	}
	if (currentPage > pages) {
		currentPage = pages;
	}
	else if (currentPage < 0) {
		currentPage = 1;
	}
	indexFirst = sessionsPerPage * (currentPage - 1);
	indexLast = (sessionsPerPage * currentPage) - 1;
	if (indexLast >= sessionCount) {
		indexLast = sessionCount - 1;
	}
	if (indexLast >= sessionCount) {
		indexLast = sessionCount - 1;
	}
	document.getElementById("page").innerHTML = currentPage + "/" + pages;
	fillTable(sessions);
}

function fillTable(sessions) {
	while (table.firstChild) {
		table.removeChild(table.firstChild);
	}
	for (let sessionIndex = indexFirst; sessionIndex <= indexLast; sessionIndex++) {
		let row = table.insertRow(table.rows.length);
		row.setAttribute("class", "session-obj");
		row.setAttribute("data-id", "session-" + sessions[sessionIndex]._id);
		let cellId = row.insertCell(0);
		let cellDate = row.insertCell(1);
		let cellLatitude = row.insertCell(2);
		let cellLongitude = row.insertCell(3);
		let cellObjects = row.insertCell(4);
		let cellMap = row.insertCell(5);
		let cellButtons = row.insertCell(6);
		console.log(sessions);
		console.log(sessionIndex + "index");
		cellDate.innerHTML = convertTime(sessions[sessionIndex].date);
		let idA = document.createElement("a");
		let idText = document.createTextNode(sessionIndex + 1);
		idA.href = "view/" + sessions[sessionIndex]._id;
		idA.appendChild(idText);
		cellId.appendChild(idA);
		//cellId.innerHTML = sessionIndex + 1;
		cellLatitude.innerHTML = sessions[sessionIndex].latitude;
		cellLongitude.innerHTML = sessions[sessionIndex].longitude;
		cellObjects.innerHTML = sessions[sessionIndex].objects;
		//google link hinzufügen
		let linkText = document.createTextNode("In Google Maps anzeigen");
		let a = document.createElement("a");
		a.appendChild(linkText);
		a.setAttribute("title", "In Google Maps anzeigen");
		a.href = "https://www.google.com/maps/?q=" + sessions[sessionIndex].latitude + "," + sessions[sessionIndex].longitude;
		a.setAttribute("target", "_blank");
		cellMap.appendChild(a);
		//buttons hinzufügen
		//bearbeiten Button
		let aBearbeiten = document.createElement("a");
		aBearbeiten.setAttribute("type", "button");
		aBearbeiten.setAttribute("class", "btn btn-primary");
		aBearbeiten.href = "editSession/" + sessions[sessionIndex]._id;
		aBearbeiten.innerHTML = "Bearbeiten";
		cellButtons.appendChild(aBearbeiten);
		//löschen Button ???
		let form = document.createElement("form");
		form.setAttribute("class", "delete-form");
		let btnLöschen = document.createElement("button");
		btnLöschen.setAttribute("type", "submit");
		btnLöschen.setAttribute("data-id", "session-" + sessions[sessionIndex]._id);
		btnLöschen.setAttribute("class", "btn btn-danger delete-session");
		btnLöschen.innerHTML = "L&ouml;schen";
		form.appendChild(btnLöschen);
		cellButtons.appendChild(form);
	}
}
function convertTime(sessionDate) {
	let date = new Date(sessionDate);
	let month = "" + (date.getMonth() + 1);
	let day = "" + date.getDate();
	let year = date.getFullYear();
	if (month.length < 2) {
		month = "0" + month;
	}
	if (day.length < 2) {
		day = "0" + day;
	}
	date = day + "." + month + "." + year;
	return date;
}
