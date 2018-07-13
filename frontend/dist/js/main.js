(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
	if ((document.getElementById("back") !== null) && (document.getElementById("next") !== null)) {
		document.getElementById("back").onclick = function () {
			if (currentPage > 1) {
				currentPage--;
				paginate();
			}
		};
		document.getElementById("next").onclick = function () {
			if (currentPage < pages) {
				currentPage++;
				paginate();
			}
		};
	}
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
	request.open("GET", "/jsonSessions", true);
	request.setRequestHeader("Content-Type", "application/json");
	request.send();
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {
			sessions = JSON.parse(request.responseText);
			if (sessions.length !== 0) {
				paginate(true);
			}
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
		row.setAttribute("data-id", sessions[sessionIndex]._id);
		let cellId = row.insertCell(0);
		let cellDate = row.insertCell(1);
		let cellLatitude = row.insertCell(2);
		let cellLongitude = row.insertCell(3);
		let cellObjects = row.insertCell(4);
		let cellMap = row.insertCell(5);
		let cellEdit = row.insertCell(6);
		let cellDelete = row.insertCell(7);
		cellDate.innerHTML = convertTime(sessions[sessionIndex].date);
		let idA = document.createElement("a");
		let idText = document.createTextNode(sessionIndex + 1);
		idA.href = "sessions/" + sessions[sessionIndex]._id;
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
		aBearbeiten.href = "edit/" + sessions[sessionIndex]._id;
		aBearbeiten.innerHTML = "Bearbeiten";
		cellEdit.appendChild(aBearbeiten);

		let aDelete = document.createElement("button");
		aDelete.setAttribute("class", "btn btn-danger");
		aDelete.setAttribute("id", sessions[sessionIndex]._id);
		aDelete.innerHTML = "L&ouml;schen";
		cellDelete.appendChild(aDelete);
	}
	$(".btn-danger").on("click", function () {
		const id = $(this).attr("id");
		let path = "/sessions/" + id;
		$.ajax({
			type: "DELETE",
			url: path,
			success: function () {
				return false;
			},
			error: function (err) {
				console.error(err);
			}
		});
		location.reload();
	});
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

},{}]},{},[1]);
