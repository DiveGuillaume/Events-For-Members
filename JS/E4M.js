/*
used by temporary code searchmember-with-XHR.php
*/
function PlayersObjToTable(playerlist) {
	var i = 0;
	var tablech = '';
	var debugch='';
	tablech += '<table>';
	tablech += '<tr>';
	tablech += '<th>idFFE</th>';
	tablech += '<th>nom</th>';
	tablech += '<th>prénom</th>';
	tablech += '<th>elo</th>';
	tablech += '<th>cat</th>';
	tablech += '<th>club</th>';
	tablech += '<th>ville</th>';
	
	tablech += '</tr>';
	//console.log('response', this.response); // ça marche
	for (i in playerlist){
		
		tablech += '<tr onclick = pickplayer(\'' + playerlist[i].id + '\')>';
		tablech += '<td>' + playerlist[i].fede_id + '</td>';
		tablech += '<td>' + playerlist[i].lastname + '</td>';
		tablech += '<td>' + playerlist[i].firstname + '</td>';
		tablech += '<td>' + playerlist[i].rating + '</td>';
		tablech += '<td>' + playerlist[i].cat + '</td>';
		tablech += '<td>' + playerlist[i].club_name + '</td>';
		tablech += '<td>' + playerlist[i].city + '</td>';
		tablech += '</tr>';
	}
	tablech += '<table>';
	return tablech;
}
function CatArrayToList (FullList, ShortList) {
	/*
	Constructs a html div block where all elements of FullList are displayed with class E4M_on/off
	whether the element is included or not in ShortList
	*/
	let html_string="";
	let Style_on = "E4M_on";
	let Style_off = "E4M_off";
	
	html_string += "<div class='E4M_catlist'>" ;
	FullList.forEach(function(element){
		if (ShortList.includes(element)){
			html_string += "<div class='"+ Style_on + "'>" + element + "</div>";
		} else {
			html_string += "<div class='"+ Style_off + "'>" + element + "</div>";
		}
	});
	html_string += "</div>" ;
	return html_string;
}
/*function MaSomme(a,b){
	console.log (str['Gender']);
	return a+b;
	
}*/
function Hello(){
	console.log (str['Gender']);
}
function eventInfos2html (infoset){
	/* 	
	constructs a HTML bloc from the object containing events infos 	
	input : infoset = associative array with event information (name, datestart,...)
	*/
	let html_string="";
	html_string += "<h3>" + infoset.name + "</h3>" ;
	html_string += "<p>" + infoset.datestart + "</p>" ;
	html_string += "<p>" + str['Date_max_registration'] + " : " +infoset.datelim + "</p>" ;
	if (infoset.secured =="1"){
		html_string += str['Event_secured_info'] + "</p>" ;
	} else {
		html_string += "<p>" + str['Event_notsecured_info'] + "</p>" ;
	}
	html_string += "<p>" + str['Contact'] + " : " + infoset.contact +"</p>" ;
	if (infoset.pos_long !==null && infoset.pos_lat !==null ){
		let url = "https://openstreetmap.org/"
		url+="?mlat="+infoset.pos_lat;
		url+="&mlon="+infoset.pos_long;
		url+="#map=17";
		url+="/"+infoset.pos_lat;
		url+="/="+infoset.pos_long;
		html_string += "<p>" + str['Show_on_map'] + " <a href = " + url 
		html_string += " target='_blank'><img src='./img/geomarker.png'> </a></p>" ;
		
		/* debug niveau de zoom (#map) pas respecté, à creuser, pourquoi ? */
	}
	html_string += str['Nb_tot_reg'] + " : " + NbRegTot;
	return html_string;
}
function SubeventInfos2html (infoset){
	/*
	constructs a HTML bloc from the object containing subevents infos 	
	input : infoset = associative array with subevent information (name, rating_type,...)
	*/
	let html_string="";
	
	/* subevent name */
	html_string += "<h3>" + infoset.name + "</h3>" ;
	
	/* date subevent */
	if (infoset.datestart !== null){
		html_string += "<p>" + infoset.datestart + "</p>" ;
	}
	/* gender */
	html_string += "<p>" + str['Gender'] + " : ";
	let gender_array = new Array();
	if (infoset.gender == "*") {
		gender_array = gender_names;
	} else {
		gender_array = JSON.parse(infoset.gender);
	}
	let iconString = CatArrayToList (gender_names, gender_array); 
	html_string += iconString + "</p>";
	
	/* categories */
	html_string += "<p>" + str['Categories'] + " : ";
	let cat_array = new Array();
	if (infoset.cat == "*") {
		cat_array = cat_names;
	} else {
		cat_array = JSON.parse(infoset.cat);
	}
	iconString = CatArrayToList (cat_names, cat_array); 
	html_string += iconString + "</p>";
	
	/* max participants */
	if (infoset.nbmax !==  null){
		html_string += "<p>" + str['Nb_max_participants'] + " : " + infoset.nbmax + "</p>" ;
	}
	/* link */
	if (infoset.link !== null){
		html_string += "<p>" + str['Label_link_to_sub'] + " : <a href=" + infoset.link + ">"+infoset.link+"</a></p>" ;
	}
	
	/* rating_type + optional rating restriction */
	let restriction_string="";
	if (infoset.rating_restriction == 1) {
		restriction_string = infoset.rating_comp + infoset.rating_limit;
	} 
	html_string += "<p>" + str['Rating_name'] +" : " + rating_names[infoset.rating_type-1] + " " + restriction_string  +"</p>" ;
	
	
	return html_string;
	
}
function BuildHTMLEventSelector (n){
	/* 	Builds the set of number one can click on to select subevent */
	/* 	Should not be called if NbSubEvents =1 */
	
	let html_string="<div class='E4M_buttonset'>";
	let k=0;
	let sel = document.getElementById('E4M_select_event');
	
	for (k=0; k<=n-1; k++) {
		
		if (k == CurrentSubEvent){
			html_string += "<div onclick=SelectEvent(" + k + ") id='selector_"+ k + "' class='current_sub_button' ><p>" + (k+1) + "</p></div>";
		} else {
			html_string += "<div onclick=SelectEvent(" + k + ") id='selector_"+ k + "' class='other_sub_button' ><p>" + (k+1) + "</p></div>";
		}
	}
	html_string +="</div>";
	sel.innerHTML = html_string;
}
function RegList2htmltable (infoset, subid){
	/* 	
	constructs a HTML table bloc from the object containing the list of registered members for a specific subevent	
	input1 : infoset = array of members registred to the selected subevent
	input2 : subid = id of subevent
	*/
	let html_string="";
	let k=0;
	let nbreg = infoset.length; // which is actually nbtotreg !! debug
	
	let sublist = infoset.filter(function(filter){
		return filter.subid == CurrentSubEventId ;
	});
	
	let nbregsub = sublist.length;
	html_string += "<p><?=$str['Nb_reg']?> : " + nbregsub + "</p>" ;
	
	html_string += "<table>" ;
	rating_selector = "rating"+ CurrentRating;
	/* sublist contains the list filtered for current subevent, the html table is filled with these members */
	sublist.forEach(function(member){
		html_string += "<tr>" ;
		html_string += "<td>" + member.lastname + " "+member.firstname + "</td>";
		html_string += "<td>" + member[rating_selector]+"</td>";
		html_string += "<td>" + member.clubname+"</td>";
		html_string += "<td>" + member.region+"</td>";
		html_string += "</tr>" ;
	});
	html_string += "</table>" ;
	return html_string;
}
function SelectEvent(NumEvent) {
	CurrentSubEvent = NumEvent;
	if (NbSubs > 1){
			BuildHTMLEventSelector (NbSubs);
	}
	CurrentSubEventId = subevent_list[NumEvent]["id"];
	CurrentRating = subevent_list[NumEvent]["rating_type"]; 
	subevent_html_id.innerHTML = SubeventInfos2html(subevent_list[CurrentSubEvent]);
	registred_html_id.innerHTML = RegList2htmltable (member_list, NumEvent);
}
function download() {
	let CSVstring ="";
	let sublist = member_list.filter(function(filter){
		return filter.subid == CurrentSubEventId ;
	});
	rating_selector = "rating"+ CurrentRating;
	/* sublist contains the list filtered for current subevent, the html table is filled with these members */
	sublist.forEach(function(member){
		CSVstring += member.memberid + ";";
		CSVstring += member.fede_id + ";";
		CSVstring += member.lastname + ";";
		CSVstring += member.firstname + ";";
		CSVstring += member[rating_selector]+ ";";
		CSVstring += member.clubname+ ";";
		CSVstring += member.region+ ";";
		CSVstring += "\n" ;
	});
	var filename =subevent_list[CurrentSubEvent].name +".csv";
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(CSVstring));
	element.setAttribute('download', filename);
	element.style.display = 'none';// necessary ??
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element); // necessary ??
	}
