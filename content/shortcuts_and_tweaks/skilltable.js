/**
	* skilltable.js
	* Show a skill table on players list page
	* @authors: convincedd, ryanli
	*/
////////////////////////////////////////////////////////////////////////////////

var FoxtrickSkillTable = {

	MODULE_NAME : "SkillTable",
	MODULE_CATEGORY : Foxtrick.moduleCategories.SHORTCUTS_AND_TWEAKS,
	PAGES : new Array("players", "YouthPlayers"),
	DEFAULT_ENABLED : true,
	NEW_AFTER_VERSION : "0.5.0.5",
	LATEST_CHANGE : "Merged youth and senior tables. Better layout and fixed copying. More customize options.",
	LATEST_CHANGE_CATEGORY : Foxtrick.latestChangeCategories.NEW,
	OPTIONS : new Array("OtherTeams"),

	_categories: new Array("", "GK", "WB", "CD", "W", "IM", "FW", "S", "R", "E1", "E2"),

	init : function() {
	},

	run : function( page, doc ) {
		try {
			this.tableCreated = false;

			var ownTeamId = FoxtrickHelper.findTeamId(doc.getElementById("teamLinks"));
			var teamId = FoxtrickHelper.findTeamId(doc.getElementById("content").getElementsByTagName("div")[0]);

			if (Foxtrick.isPage(Foxtrick.ht_pages["players"], doc)) {
				this.type = "senior";
				if (doc.location.href.indexOf("NTPlayers") != -1) {
					this.subtype = "nt";
				}
				else if ((doc.location.href.indexOf("Oldies.aspx") != -1)
					|| (doc.location.href.indexOf("Coaches\.aspx") != -1)) {
					this.subtype = "oldiesCoach";
				}
				else if (ownTeamId === teamId) {
					this.subtype = "own";
				}
				else {
					this.subtype = "others";
				}
			}
			else if (Foxtrick.isPage(Foxtrick.ht_pages["YouthPlayers"], doc)) {
				this.type = "youth";
				if (ownTeamId === teamId) {
					this.subtype = "own";
				}
				else {
					this.subtype = "others";
				}
			}

			if (!this.subtype === "own" && !Foxtrick.isModuleFeatureEnabled(FoxtrickSkillTable, "OtherTeams")) {
				return;
			}

			FoxtrickSkillTable.addTableDiv(doc);
		}
		catch(e) {
			Foxtrick.dumpError(e);
		}
	},

	change : function( page, doc ) {
	},

	createSeniorTable : function(doc) {
		try {
			var hasbars = true;
			var allDivs = doc.getElementsByTagName("div");
			if (this.subtype === "own") {
				for (var i = 0; i < allDivs.length; i++) {
					if(allDivs[i].className=="playerInfo") {
						var trs = allDivs[i].getElementsByTagName("table")[0].getElementsByTagName("tr");
						if (trs.length==4) {hasbars=false; break;}
					}
				}
				Foxtrick.dump("hasbars: "+hasbars+"\n");
			}

			var sn;
			if (hasbars) {
				sn = [
					{ name: "PlayerCategory", sort: "index", own: true },
					{ name: "PlayerNumber", sort: "index", own: true, others: true },
					{ name: "Nationality", sort: "title", own: true, others: true },
					{ name: "Player", sort: "link", own: true, others:true, nt: true, oldiesCoach: true },
					{ name: "Age", sort: "age", own: true, others:true, nt: true, oldiesCoach: true },
					{ name: "TSI", sort: "int", own: true, others:true, nt: true, oldiesCoach: true },
					{ name: "Agreeability", sort: "int", own: true, others:true, oldiesCoach: true },
					{ name: "Aggressiveness", sort: "int", own: true, others:true, oldiesCoach: true },
					{ name: "Honesty", sort: "int", own: true, others:true, oldiesCoach: true },
					{ name: "Leadership", sort: "int", own: true, others:true, nt: true, oldiesCoach: true },
					{ name: "Experience", sort: "int", own: true, others:true, nt: true, oldiesCoach: true },
					{ name: "Form", sort: "int", own: true, others:true, nt: true, oldiesCoach: true },
					{ name: "Stamina", sort: "int", own: true, others:true, nt: true, oldiesCoach: true },
					{ name: "Keeper", sort: "int", own: true },
					{ name: "Defending", sort: "int", own: true },
					{ name: "Playmaking", sort: "int", own: true },
					{ name: "Winger", sort: "int", own: true },
					{ name: "Passing", sort: "int", own: true },
					{ name: "Scoring", sort: "int", own: true },
					{ name: "Set_pieces", sort: "int", own: true },
					{ name: "Yellow_card", sort: "text", own: true, others: true, nt: true, oldiesCoach: true, img: "/Img/Icons/yellow_card.gif" },
					{ name: "Red_card", sort: "text", own: true, others: true, nt: true, oldiesCoach: true, img: "/Img/Icons/red_card.gif" },
					{ name: "Bruised", sort: "text", own: true, others: true, nt: true, oldiesCoach: true, img: "/Img/Icons/bruised.gif" },
					{ name: "Injured", sort: "text", own: true, others: true, nt: true, oldiesCoach: true, img: "/Img/Icons/injured.gif" },
					{ name: "Speciality", sort: "text", own: true, others: true, nt: true, oldiesCoach: true },
					{ name: "Last_match", sort: "date", own: true, others: true },
					{ name: "Last_stars", sort: "text", own: true, others: true, img: "/Img/Matches/star_blue.png" },
					{ name: "Last_position", sort: "text", own: true, others: true },
					{ name: "Salary", sort: "int", own: true, others: true },
					{ name: "TransferListed", sort: "text", own: true, others: true, oldiesCoach: true, img: "/Img/Icons/dollar.gif" },
					{ name: "NrOfMatches", sort: "int", nt: true },
					{ name: "LeagueGoals", sort: "int", own: true, others: true, oldiesCoach: true },
					{ name: "CareerGoals", sort: "int", own: true, others: true, oldiesCoach: true }
				];
			}
			else {
				sn = [
					{ name: "PlayerCategory", sort: "index", own: true },
					{ name: "PlayerNumber", sort: "index", own: true, others: true },
					{ name: "Nationality", sort: "title", own: true, others: true },
					{ name: "Player", sort: "link", own: true, others:true, nt: true, oldiesCoach: true },
					{ name: "Age", sort: "age", own: true, others:true, nt: true, oldiesCoach: true },
					{ name: "TSI", sort: "int", own: true, others:true, nt: true, oldiesCoach: true },
					{ name: "Agreeability", sort: "int", own: true, others:true, oldiesCoach: true },
					{ name: "Aggressiveness", sort: "int", own: true, others:true, oldiesCoach: true },
					{ name: "Honesty", sort: "int", own: true, others:true, oldiesCoach: true },
					{ name: "Leadership", sort: "int", own: true, others:true, nt: true, oldiesCoach: true },
					{ name: "Experience", sort: "int", own: true, others:true, nt: true, oldiesCoach: true },
					{ name: "Form", sort: "int", own: true, others:true, nt: true, oldiesCoach: true },
					{ name: "Stamina", sort: "int", own: true, others:true, nt: true, oldiesCoach: true },
					{ name: "Keeper", sort: "int", own: true },
					{ name: "Playmaking", sort: "int", own: true },
					{ name: "Passing", sort: "int", own: true },
					{ name: "Winger", sort: "int", own: true },
					{ name: "Defending", sort: "int", own: true },
					{ name: "Scoring", sort: "int", own: true },
					{ name: "Set_pieces", sort: "int", own: true },
					{ name: "Yellow_card", sort: "text", own: true, others: true, nt: true, oldiesCoach: true, img: "/Img/Icons/yellow_card.gif" },
					{ name: "Red_card", sort: "text", own: true, others: true, nt: true, oldiesCoach: true, img: "/Img/Icons/red_card.gif" },
					{ name: "Bruised", sort: "text", own: true, others: true, nt: true, oldiesCoach: true, img: "/Img/Icons/bruised.gif" },
					{ name: "Injured", sort: "text", own: true, others: true, nt: true, oldiesCoach: true, img: "/Img/Icons/injured.gif" },
					{ name: "Speciality", sort: "text", own: true, others: true, nt: true, oldiesCoach: true },
					{ name: "Last_match", sort: "date", own: true, others: true },
					{ name: "Last_stars", sort: "text", own: true, others: true, img: "/Img/Matches/star_blue.png" },
					{ name: "Last_position", sort: "text", own: true, others: true },
					{ name: "Salary", sort: "int", own: true, others: true },
					{ name: "TransferListed", sort: "text", own: true, others: true, oldiesCoach: true, img: "/Img/Icons/dollar.gif" },
					{ name: "NrOfMatches", sort: "int", nt: true },
					{ name: "LeagueGoals", sort: "int", own: true, others: true, oldiesCoach: true },
					{ name: "CareerGoals", sort: "int", own: true, others: true, oldiesCoach: true }
				];
			}

			for (var j = 0; j < sn.length; ++j) {
				if (this.subtype === "own" && !sn[j].own) {
					sn[j].available = false;
				}
				else if (this.subtype === "others" && !sn[j].others) {
					sn[j].available = false;
				}
				else if (this.subtype === "nt" && !sn[j].nt) {
					sn[j].available = false;
				}
				else if (this.subtype === "oldiesCoach" && !sn[j].oldiesCoach) {
					sn[j].available = false;
				}
				else {
					sn[j].available = true;
					sn[j].enabled = FoxtrickSkillTable.getColumnEnabled(sn[j].name);
				}
			}
			var customizeTable = FoxtrickSkillTable.createCustomizeTable(sn, doc);
			Foxtrick.addClass(customizeTable, "hidden");

			var table = doc.createElement("table");
			table.id = "ft_skilltable";
			table.className = "ft_skilltable";
			thead = doc.createElement("thead");
			var tr = doc.createElement("tr");
			thead.appendChild(tr);
			table.appendChild(thead);
			var s_index = 0;
			for (var j = 0; j < sn.length; j++) {
				if (sn[j].enabled) {
					var th = doc.createElement("th");
					th.setAttribute("s_index", s_index++);
					if (sn[j].sort) {
						th.setAttribute("sort", sn[j].sort);
					}
					Foxtrick.addEventListenerChangeSave(th, "click", FoxtrickSkillTable.sortClick, false);

					var fullName = Foxtrickl10n.getString(sn[j].name);
					var abbrName = Foxtrickl10n.getString(sn[j].name + ".abbr");
					var abbr = true;
					if (!abbrName || fullName === abbrName) {
						abbr = false;
					}
					if (abbr) {
						if (sn[j].img) {
							var img = doc.createElement("img");
							img.setAttribute("src", sn[j].img);
							img.setAttribute("alt", abbrName);
							img.setAttribute("title", fullName);
							th.appendChild(img);
						}
						else {
							var abbr = doc.createElement("abbr");
							abbr.setAttribute("title", fullName);
							abbr.appendChild(doc.createTextNode(abbrName));
							th.appendChild(abbr);
						}
					}
					else {
						if (sn[j].img) {
							var img = doc.createElement("img");
							img.setAttribute("src", sn[j].img);
							img.setAttribute("alt", fullName);
							img.setAttribute("title", fullName);
						}
						else {
							th.appendChild(doc.createTextNode(fullName));
						}
					}
					tr.appendChild(th);
				}
			}

			var tbody = doc.createElement("tbody");
			table.appendChild(tbody);

			var count =0;
			for(var i = 0; i < allDivs.length; i++) {
				if(allDivs[i].className=="playerInfo") {
					count++;
					var k=0;
					var sktable = allDivs[i].getElementsByTagName("table")[0];
					if (sktable && sktable.parentNode.className.search("myht2")!=-1) sktable=null;
					if (sktable) var trs = sktable.getElementsByTagName("tr");

					var hasflag = (allDivs[i].getElementsByTagName("a")[0].innerHTML.search(/flags.gif/i)!=-1);
					var link_off=0;
					if (hasflag) link_off=1;

					if (Foxtrick.XMLData.playersxml) {
						var playerid = allDivs[i].getElementsByTagName("a")[0+link_off].href.replace(/.+playerID=/i, "").match(/^\d+/)[0];

						var playerlist = Foxtrick.XMLData.playersxml.getElementsByTagName("Player");
						for (var j=0; j<playerlist.length; ++j) {
							var data = new Array();
							var thisPlayerID = playerlist[j].getElementsByTagName("PlayerID")[0].textContent;
							if (thisPlayerID==playerid) {
								if (this.subtype === "nt") {
								var NrOfMatches = playerlist[j].getElementsByTagName("NrOfMatches")[0].textContent;
								}
								else {
								if (sn[0].available) {
									var PlayerCategoryId = playerlist[j].getElementsByTagName("PlayerCategoryId")[0].textContent;
									if (PlayerCategoryId!=0) var PlayerCategory = Foxtrickl10n.getString("categories."+FoxtrickSkillTable._categories[PlayerCategoryId]);
									else {
										var PlayerCategory="";
										PlayerCategoryId = 100; // increased index for sorting
									}
								}
								var Agreeability = playerlist[j].getElementsByTagName("Agreeability")[0].textContent;
								var Aggressiveness = playerlist[j].getElementsByTagName("Aggressiveness")[0].textContent;
								var Honesty = playerlist[j].getElementsByTagName("Honesty")[0].textContent;

								var LeagueGoals = playerlist[j].getElementsByTagName("LeagueGoals")[0].textContent;
								if (LeagueGoals=="Not available") LeagueGoals="?";

								var CareerGoals = playerlist[j].getElementsByTagName("CareerGoals")[0].textContent;
								if (CareerGoals=="Not available") CareerGoals="?";

								// textcontent is 1 if the player is on the transfer list, otherwise 0.
								var TransferListed = playerlist[j].getElementsByTagName("TransferListed")[0].textContent;
								if (TransferListed === "0") {
									TransferListed = "";
								}

								//If the player is enrolled on a national team, this is that national team"s ID. Otherwise will return 0.
								var NationalTeamID = playerlist[j].getElementsByTagName("NationalTeamID")[0].textContent;
								//var Caps = playerlist[j].getElementsByTagName("Caps")[0].textContent;	//The number of matches played for the national team.
								var currencyRate = FoxtrickPrefs.getString("currencyRate"); // this is value of tag CODE from htcurrency.xml
								var Salary = parseInt(playerlist[j].getElementsByTagName("Salary")[0].textContent)/10/currencyRate; // from kroner to euro to selecte							
								var TSI = playerlist[j].getElementsByTagName("TSI")[0].textContent;
								var Age = playerlist[j].getElementsByTagName("Age")[0].textContent;
								var AgeDays = playerlist[j].getElementsByTagName("AgeDays")[0].textContent;
								var age = new Array(); age.push(Age); age.push(AgeDays);
								var Leadership = playerlist[j].getElementsByTagName("Leadership")[0].textContent;
								var Experience = playerlist[j].getElementsByTagName("Experience")[0].textContent;
								var CountryID = playerlist[j].getElementsByTagName("CountryID")[0].textContent;
								var LeagueID = Foxtrick.XMLData.countryid_to_leagueid[CountryID];
								var TrainerData = playerlist[j].getElementsByTagName("TrainerData")[0];
								var PlayerNumber = playerlist[j].getElementsByTagName("PlayerNumber")[0].textContent;

								break;
								}
							}
						}
					}

					var tr = doc.createElement("tr");
					tbody.appendChild(tr);

					// PlayerCategory
					if (this.subtype === "own" && sn[k].enabled) {
						var td = doc.createElement("td");
						td.setAttribute("style","text-align:right !important;");
						var val = PlayerCategory;
						td.setAttribute("index",PlayerCategoryId);
						td.appendChild(doc.createTextNode(val));
						tr.appendChild(td);
					}
					k++;

					// PlayerNumber
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						td.setAttribute("style","text-align:right !important;");
						var val = PlayerNumber;
						td.setAttribute("index",val);
						if (val==100) val="";
						td.appendChild(doc.createTextNode(val));
						tr.appendChild(td);
					}
					k++;

					// nationality
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						td.title = Foxtrick.XMLData.League[LeagueID].LeagueName;
						var a=doc.createElement("a");
						a.href="/World/Leagues/League.aspx?LeagueID=" + LeagueID;
						a.className ="flag inner";
						var img=doc.createElement("img");
						var style="vertical-align:top; margin-top:1px; background: transparent url(/Img/Flags/flags.gif) no-repeat scroll "+ (-20)*LeagueID+"px 0pt; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial;";
						img.setAttribute("style",style);
						img.alt = img.title = Foxtrick.XMLData.League[LeagueID].LeagueName;
						img.src="/Img/Icons/transparent.gif";
						a.appendChild(img);
						td.appendChild(a);
						tr.appendChild(td);
					}
					k++;

					// name (linked)
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						td.appendChild(allDivs[i].getElementsByTagName("a")[0+link_off].cloneNode(true));
						if (TrainerData) td.setAttribute("style","font-weight:bold;");
						tr.appendChild(td);
					}
					k++;

					// age
					if (sn[k].enabled) {
						if (!age) var age = allDivs[i].getElementsByTagName("p")[0].innerHTML.match(/(\d+)/g);
						var td = doc.createElement("td");
						td.innerHTML=age[0]+"."+age[1];
						td.setAttribute("age",age[0]+"."+(age[1].length==1?("00"+age[1]):(age[1].length==2?("0"+age[1]):age[1])));
						age=null;
						tr.appendChild(td);
					}
					k++;

					var specc = allDivs[i].getElementsByTagName( "p" )[0];

					// tsi
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						td.setAttribute("style","text-align:right !important;");
						if (!TSI) {
						var tsitot_in = allDivs[i].getElementsByTagName("p")[0].innerHTML.substr(0,specc.innerHTML.lastIndexOf("<br>"));
						if (this.subtype === "oldiesCoach" || this.subtype === "nt") {
							tsitot_in = tsitot_in.substr(0,tsitot_in.lastIndexOf("<br>"));
						}
						if (tsitot_in.search(/^\s*TSI/) != -1)
							tsitot_in = tsitot_in.replace(/,.+/,""); // In the language Vlaams, TSI and age are switched. This is a fix for that
						var lastindex = tsitot_in.lastIndexOf(" ");
						if (tsitot_in.lastIndexOf("=") > lastindex)
							lastindex = tsitot_in.lastIndexOf("=");
						tsitot_in = tsitot_in.substr(lastindex+1).replace("&nbsp;","");
						tsitot_in = parseInt(tsitot_in);
						}
						else {tsitot_in = TSI;}
						td.appendChild(doc.createTextNode(tsitot_in));
						tr.appendChild(td);
					}
					k++;

					// Agreeability
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						td.setAttribute("style","text-align:right !important;");
						var val = Agreeability;
						td.appendChild(doc.createTextNode(val));
						tr.appendChild(td);
					}
					k++;

					// Aggressiveness
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						td.setAttribute("style","text-align:right !important;");
						var val = Aggressiveness;
						td.appendChild(doc.createTextNode(val));
						tr.appendChild(td);
					}
					k++;

					// Honesty
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						td.setAttribute("style","text-align:right !important;");
						var val = Honesty;
						td.appendChild(doc.createTextNode(val));
						tr.appendChild(td);
					}
					k++;

					// Leadership
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						td.setAttribute("style","text-align:right !important;");
						var val = Leadership;
						if (this.subtype === "nt") {
							val = allDivs[i].getElementsByTagName("a")[4+link_off].href.match(/ll=(\d+)/)[1];
						}
						td.appendChild(doc.createTextNode(val));
						tr.appendChild(td);
					}
					k++;

					// Experience
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						td.setAttribute("style","text-align:right !important;");
						var val = Experience;
						if (this.subtype === "nt") {
							val = allDivs[i].getElementsByTagName("a")[3+link_off].href.match(/ll=(\d+)/)[1];
						}
						td.appendChild(doc.createTextNode(val));
						tr.appendChild(td);
					}
					k++;

					// form
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						td.setAttribute("style","text-align:right !important;");
						var val = allDivs[i].getElementsByTagName("a")[1+link_off].href.match(/ll=(\d+)/)[1];
						td.appendChild(doc.createTextNode(val));
						tr.appendChild(td);
					}
					k++;

					// stamina
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						td.setAttribute("style","text-align:right !important;");
						var val = allDivs[i].getElementsByTagName("a")[2+link_off].href.match(/ll=(\d+)/)[1];
						td.appendChild(doc.createTextNode(val));
						tr.appendChild(td);
					}
					k++;


					// skills
					var start=0,end=7,inc=1;
					if (!hasbars) {start=2,end=16;inc=2;}
					for(var j = start; j < end; j+=inc) {
						if (this.subtype === "own" && sn[k].enabled) {
							var td = doc.createElement("td");
							td.setAttribute("style","text-align:right !important;");
							tr.appendChild(td);

							if (sktable) {
								if (hasbars) {
									var tds = trs[j].getElementsByTagName("td");
									var imgs = tds[1].getElementsByTagName("img");
									var cur = imgs[0].title.match(/-?\d+/);
									td.innerHTML = cur;
								}
								else {
									var tds= allDivs[i].getElementsByTagName("table")[0].getElementsByTagName("td");
									var cur = tds[j+1].getElementsByTagName("a")[0].href.match(/ll=(\d+)/)[1];
									td.innerHTML = cur;
								}
							}
						}
						k++;
					}

					// card+injuries
					var cardsyellow=0;
					var cardsred=0;
					var bruised=0;
					var injured=0;
					var img = allDivs[i].getElementsByTagName("img");

					for(var j = 0; j < img.length; j++) {
						if (img[j].className=="cardsOne") {
							if (img[j].src.indexOf("red_card", 0) != -1 ) cardsred = 1;
							else cardsyellow=1;
						}
						if (img[j].className=="cardsTwo") {
							cardsyellow=2;
						}
						if (img[j].className=="injuryBruised") bruised=1;
						if (img[j].className=="injuryInjured") injured = img[j].nextSibling.innerHTML;
					}

					// yellow cards
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						if (cardsyellow>0) {
						td.appendChild(doc.createTextNode(cardsyellow));
						}
						tr.appendChild(td);
					}
					k++;

					// red cards
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						if (cardsred>0) {
						td.appendChild(doc.createTextNode(cardsred));
						}
						tr.appendChild(td);
					}
					k++;

					// bruised
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						if (bruised>0) {
						td.appendChild(doc.createTextNode(bruised));
						}
						tr.appendChild(td);
					}
					k++;

					// injured
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						if (injured>0) {
						td.appendChild(doc.createTextNode(injured));
						}
						tr.appendChild(td);
					}
					k++;

					// specialty
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						specMatch = specc.textContent.match(/\[(\D+)\]/);
						if (specMatch) {
							var shortspecc = FoxtrickSkillTable._getShortSpecialty(specMatch[1]);
							if (shortspecc) {
								specMatch = shortspecc;
							}
							else {
								specMatch = specMatch[1].substr(0,2);
							}
						}
						else specMatch="";
						td.appendChild(doc.createTextNode(specMatch));
						tr.appendChild(td);
					}
					k++;

					// last match
					var as=allDivs[i].getElementsByTagName("a");
					var kk=0,a=null;
					while(a=as[kk++]){if (a.href.search(/matchid/i)!=-1) break;}
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						if (a) {
							td.appendChild(a.cloneNode(true));
						}
						tr.appendChild(td);
					}
					k++;

					// stars
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						if (a) {
							var imgs=a.parentNode.parentNode.getElementsByTagName("img");
							var starcount=0;
							for (var sc=0;sc<imgs.length;++sc) {
								if (imgs[sc].className=="starBig") starcount+=5;
								else if (imgs[sc].className=="starWhole") starcount+=1;
								else if (imgs[sc].className=="starHalf") starcount+=0.5;
							}
							td.appendChild(doc.createTextNode(starcount));
						}
						tr.appendChild(td);
					}
					k++;

					// last position
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						if (a) {
							var pos = a.parentNode.nextSibling.nextSibling.innerHTML.match(/\((.+)\)/)[1];
							var shortpos = FoxtrickSkillTable._getShortPos(pos);
							if (shortpos) {
								pos = shortpos;
							}
							else {
								var sp_pos = pos.search(/ |\&nbsp;/);
								if (sp_pos == -1) pos=pos.substr(0,2)
								else pos = pos.substr(0,1)+pos.substr(sp_pos+1,1);
							}
							td.appendChild(doc.createTextNode(pos));
						}
						tr.appendChild(td);
					}
					k++;

					// Salary
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						td.setAttribute("style","text-align:right !important;");
						var val = Salary;
						td.appendChild(doc.createTextNode(val));
						tr.appendChild(td);
					}
					k++;

					// TransferListed
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						td.setAttribute("style","text-align:right !important;");
						var val = TransferListed;
						td.appendChild(doc.createTextNode(val));
						tr.appendChild(td);
					}
					k++;

					// #matches ntplayers only
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						var val = NrOfMatches ? NrOfMatches : 0;
						td.appendChild(doc.createTextNode(val));
						tr.appendChild(td);
					}
					k++;

					// LeagueGoals
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						var val = LeagueGoals;
						td.appendChild(doc.createTextNode(val));
						tr.appendChild(td);
					}
					k++;

					// CareerGoals
					if (sn[k].enabled) {
						var td = doc.createElement("td");
						var val = CareerGoals;
						td.appendChild(doc.createTextNode(val));
						tr.appendChild(td);
					}
					k++;
				}
			}

			var tablediv = doc.getElementById("ft_skilltablediv");
			FoxtrickSkillTable.insertCustomizeTable(tablediv, customizeTable);
			FoxtrickSkillTable.insertSkillTable(tablediv, table);

			var container = tablediv.getElementsByClassName("ft_skilltable_container")[0];
			if (FoxtrickPrefs.getBool("module.SkillTable.top")) {
				Foxtrick.addClass(container, "on_top");
			}
		}
		catch (e) {
			Foxtrick.dumpError(e);
		}
	},

	createYouthTable : function(doc) {
		try {
			// table headers
			// name: its corresponding name in foxtrick.properties
			// abbr: whether to use an abbreviation
			// pref: preference name of disabling this column
			var sn = [
				{ name: "Player", sort: "link", own: true, others: true },
				{ name: "Age", sort: "age", own: true, others: true },
				{ name: "Keeper", sort: "text", own: true },
				{ name: "Defending", sort: "text", own: true },
				{ name: "Playmaking", sort: "text", own: true },
				{ name: "Winger", sort: "text", own: true },
				{ name: "Passing", sort: "text", own: true },
				{ name: "Scoring", sort: "text", own: true },
				{ name: "Set_pieces", sort: "text", own: true },
				{ name: "Yellow_card", sort: "text", own: true, others: true, img: "/Img/Icons/yellow_card.gif" },
				{ name: "Red_card", sort: "text", own: true, others: true, img: "/Img/Icons/red_card.gif" },
				{ name: "Bruised", sort: "text", own: true, others: true, img: "/Img/Icons/bruised.gif" },
				{ name: "Injured", sort: "text", own: true, others: true, img: "/Img/Icons/injured.gif" },
				{ name: "Speciality", sort: "text", own: true, others: true, pref: "HideSpecialty" },
				{ name: "Last_match", sort: "date", own: true, others: true },
				{ name: "Last_stars", sort: "text", own: true, others: true, pref: "HideLastStars", img: "/Img/Matches/star_blue.png" },
				{ name: "Last_position", sort: "text", own: true, others: true, pref: "HideLastPosition" }
			];

			for (var j = 0; j < sn.length; ++j) {
				if (this.subtype === "own" && !sn[j].own) {
					sn[j].available = false;
				}
				else if (this.subtype === "others" && !sn[j].others) {
					sn[j].available = false;
				}
				else {
					sn[j].available = true;
					sn[j].enabled = FoxtrickSkillTable.getColumnEnabled(sn[j].name);
				}
			}
			var customizeTable = FoxtrickSkillTable.createCustomizeTable(sn, doc);
			Foxtrick.addClass(customizeTable, "hidden");

			var table = doc.createElement("table");
			table.id = "ft_skilltable";
			table.className = "ft_skilltable";
			thead = doc.createElement("thead");
			var tr = doc.createElement("tr");
			thead.appendChild(tr)
			table.appendChild(thead);
			var s_index = 0;
			for (var j = 0; j < sn.length; ++j) {
				if (!this.subtype === "own" && j>=2 && j<=8)
					continue;
				if (sn[j].enabled) {
					var th = doc.createElement("th");
					th.setAttribute("s_index", s_index++);
					if (sn[j].sort) {
						th.setAttribute("sort", sn[j].sort);
					}
					Foxtrick.addEventListenerChangeSave(th, "click", FoxtrickSkillTable.sortClick, false);

					var fullName = Foxtrickl10n.getString(sn[j].name);
					var abbrName = Foxtrickl10n.getString(sn[j].name + ".abbr");
					var abbr = true;
					if (!abbrName || fullName === abbrName) {
						abbr = false;
					}
					if (abbr) {
						if (sn[j].img) {
							var img = doc.createElement("img");
							img.setAttribute("src", sn[j].img);
							img.setAttribute("alt", abbrName);
							img.setAttribute("title", fullName);
							th.appendChild(img);
						}
						else {
							var abbr = doc.createElement("abbr");
							abbr.setAttribute("title", fullName);
							abbr.appendChild(doc.createTextNode(abbrName));
							th.appendChild(abbr);
						}
					}
					else {
						if (sn[j].img) {
							var img = doc.createElement("img");
							img.setAttribute("src", sn[j].img);
							img.setAttribute("alt", fullName);
							img.setAttribute("title", fullName);
						}
						else {
							th.appendChild(doc.createTextNode(fullName));
						}
					}
					tr.appendChild(th);
				}
			}

			var tbody = doc.createElement("tbody");
			table.appendChild(tbody);

			var allDivs = doc.getElementsByTagName("div");

			var count =0;
			for(var i = 0; i < allDivs.length; i++) {
				if(allDivs[i].className=="playerInfo") {
					count++;

					var trs = allDivs[i].getElementsByTagName("table")[0].getElementsByTagName("tr");

					var tr = doc.createElement("tr");
					tbody.appendChild(tr);

					var k = 0;

					// name (linked)
						if (sn[k++].enabled) {
							var td = doc.createElement("td");
							td.innerHTML = allDivs[i].getElementsByTagName("b")[0].innerHTML;
							tr.appendChild(td);
						}

					// age
						if (sn[k++].enabled) {
							var age = allDivs[i].getElementsByTagName("p")[0].innerHTML.match(/(\d+)/g);
							var td = doc.createElement("td");
							td.innerHTML=age[0]+"."+age[1];
							td.setAttribute("age",age[0]+"."+(age[1].length==1?("00"+age[1]):(age[1].length==2?("0"+age[1]):age[1])));
							tr.appendChild(td);
						}

					// skills
					if (this.subtype === "own") {
						for(var j = 0; j < 7; j++) {
							if (sn[j+2].enabled) {
								var td = doc.createElement("td");
								tr.appendChild(td);

								var tds = trs[j].getElementsByTagName("td");
								var imgs = tds[1].getElementsByTagName("img");
								if (imgs.length!=0) {
									var max = imgs[0].getAttribute("title").match(/\d/);
									var cur = imgs[1].title.match(/-?\d/);
									var unknown = imgs[1].title.match(/-1/);
									if (!cur) {
										td.innerHTML = max+"/"+max;
										td.setAttribute("class", td.getAttribute("class")+" ft_skilltable_maxed");
									}
									else {
										if (unknown) cur="-";
										if (!max) max="-";
										td.innerHTML = cur+"/"+max;
									}
								}
							}
						}
					}
					// card+injuries
					var cardsyellow=0;
					var cardsred=0;
					var bruised=0;
					var injured=0;
					var img = allDivs[i].getElementsByTagName("img");

					for(var j = 0; j < img.length; j++) {
						if (img[j].className=="cardsOne") {
							if (img[j].src.indexOf("red_card", 0) != -1 ) cardsred = 1;
							else cardsyellow=1;
						}
						if (img[j].className=="cardsTwo") {
							cardsyellow=2;
						}
						if (img[j].className=="injuryBruised") bruised=1;
						if (img[j].className=="injuryInjured") injured = img[j].nextSibling.innerHTML;
					}

					k = 9;

					if (sn[k++].enabled) {
						var td = doc.createElement("td");
						if (cardsyellow>0) {
							td.appendChild(doc.createTextNode(cardsyellow));
						}
						tr.appendChild(td);
					}

					if (sn[k++].enabled) {
						var td = doc.createElement("td");
						if (cardsred>0) {
							td.appendChild(doc.createTextNode(cardsred));
						}
						tr.appendChild(td);
					}

					if (sn[k++].enabled) {
						var td = doc.createElement("td");
						if (bruised>0) {
							td.appendChild(doc.createTextNode(bruised));
						}
						tr.appendChild(td);
					}

					if (sn[k++].enabled) {
						var td = doc.createElement("td");
						if (injured>0) {
							td.appendChild(doc.createTextNode(injured));
						}
						tr.appendChild(td);
					}

					// specialty
					if (sn[k++].enabled) {
						var td = doc.createElement("td");
						var specc = allDivs[i].getElementsByTagName( "p" )[0];
						specMatch = specc.textContent.match(/\[(\D+)\]/);
						if (specMatch) {
							var shortspecc = FoxtrickSkillTable._getShortSpecialty(specMatch[1]);
							if (shortspecc) {
								specMatch = shortspecc;
							}
							else {
								specMatch = specMatch[1].substr(0,2);
							}
						}
						else specMatch="";
						td.appendChild(doc.createTextNode(specMatch));
						tr.appendChild(td);
					}

					// last match
					var as=allDivs[i].getElementsByTagName("a");
					var kk=0,a=null;
					while(a=as[kk++]){if (a.href.search(/matchid/i)!=-1) break;}
					if (sn[k++].enabled) {
						var td = doc.createElement("td");
						if (a) {
							td.appendChild(a.cloneNode(true));
						}
						tr.appendChild(td);
					}

					// stars
					if (sn[k++].enabled) {
						var td = doc.createElement("td");
						if (a) {
							var imgs=a.parentNode.parentNode.getElementsByTagName("img");
							var starcount=0;
							for (var sc=0;sc<imgs.length;++sc) {
								if (imgs[sc].className=="starBig") starcount+=5;
								else if (imgs[sc].className=="starWhole") starcount+=1;
								else if (imgs[sc].className=="starHalf") starcount+=0.5;
							}
							td.appendChild(doc.createTextNode(starcount));
						}
						tr.appendChild(td);
					}
					// last position
					if (sn[k++].enabled) {
						var td = doc.createElement("td");
						if (a) {
							var pos = a.parentNode.nextSibling.nextSibling.innerHTML.match(/\((.+)\)/)[1];
							var shortpos = FoxtrickSkillTable._getShortPos(pos);
							if (shortpos) {
								pos = shortpos;
							}
							else {
								var sp_pos = pos.search(/ |\&nbsp;/);
								if (sp_pos == -1) pos=pos.substr(0,2)
								else pos = pos.substr(0,1)+pos.substr(sp_pos+1,1);
							}
							td.appendChild(doc.createTextNode(pos));
						}
						tr.appendChild(td);
					}
				}
			}

			var tablediv = doc.getElementById("ft_skilltablediv");
			FoxtrickSkillTable.insertCustomizeTable(tablediv, customizeTable);
			FoxtrickSkillTable.insertSkillTable(tablediv, table);
			var container = tablediv.getElementsByClassName("ft_skilltable_container")[0];
		}
		catch (e) {
			Foxtrick.dumpError(e);
		}
	},

	sortFunctions : {
		"link" : function(a, b) {
			return a.cells[FoxtrickSkillTable.sortIndex].getElementsByTagName("a")[0].innerHTML.localeCompare(b.cells[FoxtrickSkillTable.sortIndex].getElementsByTagName("a")[0].innerHTML);
		},
		"age" : function(a, b) {
			return a.cells[FoxtrickSkillTable.sortIndex].getAttribute("age").localeCompare(b.cells[FoxtrickSkillTable.sortIndex].getAttribute("age"));
		},
		"int" : function(a, b) {
			return parseInt(b.cells[FoxtrickSkillTable.sortIndex].innerHTML.replace(/\&nbsp| /g,"")) > parseInt(a.cells[FoxtrickSkillTable.sortIndex].innerHTML.replace(/\&nbsp| /g,""));
		},
		"index" : function(a, b) {
			return parseInt(b.cells[FoxtrickSkillTable.sortIndex].getAttribute("index")) < parseInt(a.cells[FoxtrickSkillTable.sortIndex].getAttribute("index"));
		},
		"title" : function(a, b) {
			return a.cells[FoxtrickSkillTable.sortIndex].getAttribute("title").localeCompare(b.cells[FoxtrickSkillTable.sortIndex].getAttribute("title"));
		},
		"text" : function(a, b) {
			return (b.cells[FoxtrickSkillTable.sortIndex].innerHTML.localeCompare(a.cells[FoxtrickSkillTable.sortIndex].innerHTML));
		},
		"date" : function(a, b) {
			return Foxtrick.getUniqueDayfromCellHTML(a.cells[FoxtrickSkillTable.sortIndex].firstChild.innerHTML) < Foxtrick.getUniqueDayfromCellHTML(b.cells[FoxtrickSkillTable.sortIndex].firstChild.innerHTML);
		}
	},

	sortClick : function(ev, doc, index, sort) {
		try {
			if (ev) {
				var doc = ev.target.ownerDocument;
				FoxtrickSkillTable.sortIndex = ev.currentTarget.getAttribute("s_index");
				FoxtrickSkillTable.sort = ev.currentTarget.getAttribute("sort");
			}
			else {
				FoxtrickSkillTable.sortIndex = index;
				FoxtrickSkillTable.sort = sort;
			}
			var table = doc.getElementById("ft_skilltable");
			var table_old = table.cloneNode(true);
			Foxtrick.dump("sortby: "+FoxtrickSkillTable.sortIndex+" "+FoxtrickSkillTable.sort+"\n");

			var rows = new Array();

			for (var i = 1; i < table.rows.length; ++i) {
				rows.push(table_old.rows[i].cloneNode(true));
			}
			//table.rows[3].innerHTML = table_old.rows[1].innerHTML;
			rows.sort(FoxtrickSkillTable.sortFunctions[FoxtrickSkillTable.sort]);

			for (var i = 1; i < table.rows.length; ++i) {
				table_old.rows[i].innerHTML = rows[i-1].innerHTML;
			}
			table.innerHTML = table_old.innerHTML;

			for (var i = 0; i < table.rows[0].cells.length; ++i) {
				Foxtrick.addEventListenerChangeSave(table.rows[0].cells[i], "click", FoxtrickSkillTable.sortClick, false);
			}
		}
		catch (e) {
			Foxtrick.dumpError(e);
		}
		finally {
			if (ev) ev.stopPropagation();
		}
	},

	toggleDisplay : function(doc) {
		try {
			var tablediv = doc.getElementById("ft_skilltablediv");
			var h2 = tablediv.getElementsByTagName("h2")[0];
			Foxtrick.toggleClass(h2, "ft_boxBodyUnfolded");
			Foxtrick.toggleClass(h2, "ft_boxBodyCollapsed");
			var show = Foxtrick.hasClass(h2, "ft_boxBodyUnfolded");

			if (!FoxtrickSkillTable.tableCreated) {
				if (FoxtrickSkillTable.type === "senior") {
					FoxtrickSkillTable.createSeniorTable(doc);
				}
				else if (FoxtrickSkillTable.type === "youth"){
					FoxtrickSkillTable.createYouthTable(doc);
				}
				FoxtrickSkillTable.tableCreated = true;
			}

			var links = tablediv.getElementsByClassName("ft_skilltable_links")[0];
			var customizeTable = tablediv.getElementsByClassName("ft_skilltable_customizetable")[0];
			var container = tablediv.getElementsByClassName("ft_skilltable_container")[0];
			if (show) {
				// show the objects
				Foxtrick.removeClass(links, "hidden");
				Foxtrick.removeClass(container, "hidden");
			}
			else {
				// hide the objects
				Foxtrick.removeClass(links, "customizing");
				Foxtrick.addClass(links, "hidden");
				Foxtrick.addClass(customizeTable, "hidden");
				Foxtrick.addClass(container, "hidden");
			}
		}
		catch (e) {
			Foxtrick.dumpError(e);
		}
	},

	headerClick : function(ev) {
		FoxtrickSkillTable.toggleDisplay(ev.target.ownerDocument);
	},

	view : function(ev) {
		var doc = ev.target.ownerDocument;
		var tablediv = doc.getElementById("ft_skilltablediv");
		var container = tablediv.getElementsByClassName("ft_skilltable_container")[0];
		Foxtrick.toggleClass(container, "on_top");

		FoxtrickPrefs.setBool("module.SkillTable.top", Foxtrick.hasClass(container, "on_top"));
	},

	customize : function(ev) {
		var doc = ev.target.ownerDocument;
		var links = doc.getElementsByClassName("ft_skilltable_links")[0];
		Foxtrick.addClass(links, "customizing");

		var customizeTable = doc.getElementsByClassName("ft_skilltable_customizetable")[0];
		Foxtrick.removeClass(customizeTable, "hidden");

		var container = doc.getElementsByClassName("ft_skilltable_container")[0];
		Foxtrick.addClass(container, "hidden");
	},

	save : function(ev) {
		try {
			var doc = ev.target.ownerDocument;

			var tablediv = doc.getElementById("ft_skilltablediv");
			var input = tablediv.getElementsByTagName("input");
			for (var i=0; i<input.length; ++i) {
				FoxtrickSkillTable.setColumnEnabled(input[i].id, input[i].checked);
			}
			doc.location.reload();
		}
		catch (e) {
			Foxtrick.dumpError(e);
		}
	},

	cancel : function(ev) {
		try {
			var doc = ev.target.ownerDocument;
			var tablediv = doc.getElementById("ft_skilltablediv");
			var links = tablediv.getElementsByClassName("ft_skilltable_links")[0];
			var customizeTable = tablediv.getElementsByClassName("ft_skilltable_customizetable")[0];
			var container = tablediv.getElementsByClassName("ft_skilltable_container")[0];
			Foxtrick.removeClass(links, "customizing");
			Foxtrick.addClass(customizeTable, "hidden");
			Foxtrick.removeClass(container, "hidden");
		}
		catch(e) {
			Foxtrick.dumpError(e);
		}
	},

	addTableDiv : function(doc) {
		var tablediv = doc.createElement("div");
		tablediv.id = "ft_skilltablediv";
		tablediv.className = "ft_skilltablediv";

		// table div head
		var h2 = doc.createElement("h2");
		h2.className = "ft_boxBodyCollapsed";
		h2.appendChild(doc.createTextNode(Foxtrickl10n.getString("Skill_table")));
		Foxtrick.addEventListenerChangeSave(h2, "click", FoxtrickSkillTable.headerClick, false);
		tablediv.appendChild(h2);

		// links
		var links = doc.createElement("div");
		links.className = "ft_skilltable_links";
		Foxtrick.addClass(links, "hidden");
		// links: copy
		var copy = doc.createElement("a");
		copy.className = "customize_item secondary";
		copy.appendChild(doc.createTextNode(Foxtrickl10n.getString("Copy")));
		copy.setAttribute("title", Foxtrickl10n.getString("foxtrick.tweaks.copyskilltable"));
		Foxtrick.addEventListenerChangeSave(copy, "click", FoxtrickSkillTable.copyTable, false);
		// links: customize
		var customize = doc.createElement("a");
		customize.className = "customize_item";
		customize.appendChild(doc.createTextNode(Foxtrickl10n.getString("foxtrick.prefs.buttonCustomize")));
		Foxtrick.addEventListenerChangeSave(customize, "click", FoxtrickSkillTable.customize, false);
		// links: save
		var save = doc.createElement("a");
		save.appendChild(doc.createTextNode(Foxtrickl10n.getString("foxtrick.prefs.buttonSave")));
		Foxtrick.addEventListenerChangeSave(save, "click", FoxtrickSkillTable.save, false);
		// links: cancel
		var cancel = doc.createElement("a");
		cancel.appendChild(doc.createTextNode(Foxtrickl10n.getString("foxtrick.prefs.buttonCancel")));
		Foxtrick.addEventListenerChangeSave(cancel, "click", FoxtrickSkillTable.cancel, false);
		// links: all children
		links.appendChild(copy);
		links.appendChild(customize);
		links.appendChild(save);
		links.appendChild(cancel);

		// customize table wrapper
		var customizeWrapper = doc.createElement("div");
		customizeWrapper.className = "ft_skilltable_customizewrapper";

		// table container
		var container = doc.createElement("div");
		container.className = "ft_skilltable_container";
		Foxtrick.addClass(container, "hidden");
		// table container: switch view
		var switchView = doc.createElement("div");
		var switchViewLink = doc.createElement("a");
		switchViewLink.appendChild(doc.createTextNode(Foxtrickl10n.getString("Switch_view")));
		switchViewLink.setAttribute("title", Foxtrickl10n.getString("foxtrick.SkillTable.Switch_view_title"));
		Foxtrick.addEventListenerChangeSave(switchViewLink, "click", FoxtrickSkillTable.view, false);
		switchView.appendChild(switchViewLink);
		// table container: table wrapper
		var wrapper = doc.createElement("div");
		wrapper.className = "ft_skilltable_wrapper";
		// table container: all children
		container.appendChild(switchView);
		container.appendChild(wrapper);

		tablediv.appendChild(h2);
		tablediv.appendChild(links);
		tablediv.appendChild(customizeWrapper);
		tablediv.appendChild(container);

		// insert tablediv
		var header = doc.getElementsByTagName("h1")[0];
		header.parentNode.insertBefore(tablediv, header.nextSibling);

		return tablediv;
	},

	insertCustomizeTable : function(tablediv, customizeTable) {
		var wrapper = tablediv.getElementsByClassName("ft_skilltable_customizewrapper")[0];
		wrapper.appendChild(customizeTable);
	},

	insertSkillTable : function(tablediv, skillTable) {
		var wrapper = tablediv.getElementsByClassName("ft_skilltable_wrapper")[0];
		wrapper.appendChild(skillTable);
	},

	createCustomizeTable : function(properties, doc) {
		var table = doc.createElement("table");
		table.className = "ft_skilltable_customizetable";
		var thead = doc.createElement("thead");
		var tbody = doc.createElement("tbody");
		var headRow = doc.createElement("tr");
		var checkRow = doc.createElement("tr");
		table.appendChild(thead);
		table.appendChild(tbody);
		thead.appendChild(headRow);
		tbody.appendChild(checkRow);
		for (var i = 0; i < properties.length; ++i) {
			if (properties[i].available) {
				var th = doc.createElement("th");

				var fullName = Foxtrickl10n.getString(properties[i].name);
				var abbrName = Foxtrickl10n.getString(properties[i].name + ".abbr");
				var abbr = true;
				if (!abbrName || fullName === abbrName) {
					abbr = false;
				}
				if (abbr) {
					if (properties[i].img) {
						var img = doc.createElement("img");
						img.setAttribute("src", properties[i].img);
						img.setAttribute("alt", abbrName);
						img.setAttribute("title", fullName);
						th.appendChild(img);
					}
					else {
						var abbr = doc.createElement("abbr");
						abbr.setAttribute("title", fullName);
						abbr.appendChild(doc.createTextNode(abbrName));
						th.appendChild(abbr);
					}
				}
				else {
					if (properties[i].img) {
						var img = doc.createElement("img");
						img.setAttribute("src", properties[i].img);
						img.setAttribute("alt", fullName);
						img.setAttribute("title", fullName);
					}
					else {
						th.appendChild(doc.createTextNode(fullName));
					}
				}
				var td = doc.createElement("td");
				var check = doc.createElement("input");
				check.id = properties[i].name;
				check.setAttribute("type", "checkbox");
				if (properties[i].enabled) {
					check.setAttribute("checked", "checked");
				}
				td.appendChild(check);
				headRow.appendChild(th);
				checkRow.appendChild(td);
			}
		}
		return table;
	},

	getColumnEnabled : function(name) {
		return FoxtrickPrefs.getBool("module.SkillTable." + this.type + "." + this.subtype + "." + name);
	},

	setColumnEnabled : function(name, enabled) {
		FoxtrickPrefs.setBool("module.SkillTable." + this.type + "." + this.subtype + "." + name, enabled);
	},

	copyTable : function(ev) {
		try {
			var doc = ev.target.ownerDocument;
			var table = doc.getElementsByClassName("ft_skilltable")[0];
			Foxtrick.copyStringToClipboard(FoxtrickSkillTable.toHtMl(table));
			if (FoxtrickPrefs.getBool( "copyfeedback" ))
				Foxtrick.alert(Foxtrickl10n.getString("foxtrick.tweaks.skilltablecopied"));
		}
		catch (e) {
			Foxtrick.dumpError(e);
		}
	},

	toHtMl : function(table) {
		try {
			var ret = "[table]";
			for (var rowIndex = 0; rowIndex < table.rows.length; ++rowIndex) {
				var row = table.rows[rowIndex];
				ret += "[tr]";
				for (var cellIndex = 0; cellIndex < row.cells.length; ++cellIndex) {
					var cell = row.cells[cellIndex];
					var tagName = cell.tagName.toLowerCase();
					ret += "[" + tagName + "]" + this._getCell(cell) + "[/" + tagName +"]";
				}
				ret += "[/tr]";
			}
			ret += "[/table]";
			return ret;
		}
		catch (e) {
			Foxtrick.dumpError(e);
		}
	},

	_getCell : function(cell) {
		var imgs = cell.getElementsByTagName("img");
		if (imgs.length > 0) {
			return imgs[0].getAttribute("alt");
		}
		else {
			return Foxtrick.trim(cell.textContent);
		}
	},

	_getShortPos: function(pos) {
		var short_pos="";
		try {
			var lang = FoxtrickPrefs.getString("htLanguage");
		}
		catch (e) {
			return null;
		}

		try {
			var type = pos.replace(/&nbsp;/," ");
			var path = "hattricklanguages/language[@name=\"" + lang + "\"]/positions/position[@value=\"" + type + "\"]";
			short_pos = Foxtrick.xml_single_evaluate(Foxtrick.XMLData.htLanguagesXml, path, "short");
			return short_pos
		}
		catch (e) {
			Foxtrick.dumpError(e);
			return null;
		}

		return short_pos;
	},

	_getShortSpecialty: function(pos) {
		var short_pos="";
		try {
			var lang = FoxtrickPrefs.getString("htLanguage");
		}
		catch (e) {
			return null;
		}

		try {
			var type = pos.replace(/&nbsp;/," ");
			var path = "hattricklanguages/language[@name=\"" + lang + "\"]/specialties/specialty[@value=\"" + type + "\"]";
			short_pos = Foxtrick.xml_single_evaluate(Foxtrick.XMLData.htLanguagesXml, path, "short");
			return short_pos;
		}
		catch (e) {
			Foxtrick.dumpError(e);
			return null;
		}

		return short_pos;
	}
}
