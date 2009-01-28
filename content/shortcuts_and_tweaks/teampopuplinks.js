/**
 * teampopuplinks.js
 * Foxtrick show Team Popup
 * @author bummerland
 */
////////////////////////////////////////////////////////////////////////////////
var FoxtrickTeamPopupLinks = {
    
    MODULE_NAME : "TeamPopupLinks",
        MODULE_CATEGORY : Foxtrick.moduleCategories.SHORTCUTS_AND_TWEAKS,
        DEFAULT_ENABLED : true,
        OPTIONS : {},

    init : function() {
        Foxtrick.registerAllPagesHandler( FoxtrickTeamPopupLinks );
                this.initOptions();
    },

    run : function( doc ) {
                if (!FoxtrickPrefs.getBool("module.TeamPopupLinks.enabled"))
                        return;
                var sUrl = Foxtrick.getHref( doc );
				
                //do not display pop-up on Forum pages
                var redir_from_forum=false;
				if (sUrl.search(/Forum\/Default/i) != -1) return;
                if (sUrl.search(/Forum/i) != -1) redir_from_forum=true; //  ***remove return to get popups on forum activated***  also use new 'zaw' bellow
                if (sUrl.search(/ShowOldConnections=true/i) > -1){
                        var a = doc.getElementById("ctl00_CPMain_lnkShowLogins");
                        if (a){
                                var func = a.href;
                                if (func){
                                        doc.location.href = func;
                                }
                        }
                }
				
				var teamdiv = doc.getElementById('teamLinks');
				var ownleagueid = findLeagueLeveUnitId(teamdiv);
				var ownteamid=0;
				if (ownleagueid!=null) {
					ownteamid = FoxtrickHelper.findTeamId(teamdiv);
				}
				var head = doc.getElementsByTagName("head")[0];
                var style = doc.createElement("style");
                style.setAttribute("type", "text/css");
                //determine width of the floating box - Stephan
                var maxwidth = Math.max(Foxtrickl10n.getString( 'Matches' ).length, Foxtrickl10n.getString( 'Players' ).length, 
                                                Foxtrickl10n.getString( 'last_5_ips' ).length, Foxtrickl10n.getString( 'Guestbook' ).length,
                                                Foxtrickl10n.getString( 'Coach' ).length,Foxtrickl10n.getString( 'TransferHistory' ).length,Foxtrickl10n.getString( 'LastLineup').length); //Stephan
                var bMatches = Foxtrick.isModuleFeatureEnabled( this, "Matches");
                var bPlayers = Foxtrick.isModuleFeatureEnabled( this, "Players");
                var bLast5IPs = Foxtrick.isModuleFeatureEnabled( this, "last_5_ips");
                var bGuestbook = Foxtrick.isModuleFeatureEnabled( this, "Guestbook");
                var bCoach = Foxtrick.isModuleFeatureEnabled( this, "Coach");
                var bTransferHistory = Foxtrick.isModuleFeatureEnabled( this, "TransferHistory");
                var bLastLineup = Foxtrick.isModuleFeatureEnabled( this, "LastLineup");
                var top = 0;
				if (redir_from_forum )  { if (Foxtrick.isStandardLayout(doc)) top -= 15; else top -= 20;}
				//else if (!Foxtrick.isStandardLayout(doc)) top-=20; best position in simple varies unfortunatelly. i move it down again, so it at least i always can be used.
				
                if (bMatches)
                        top = top - 20;
                if (bPlayers)
                        top = top - 20;
                if (bLast5IPs)
                        top = top - 20;
                if (bGuestbook)
                        top = top - 20;
                if (bCoach)
                        top = top - 20;
                if (bTransferHistory)
                        top = top - 20;
                if (bLastLineup)
                        top = top - 20;
				// old
//				var zaw = 'span.myht1 {position: relative} div.myht2 {display: none} span.myht1:hover div.myht2 {display: inline; width: maxwidth; position: absolute; left: 20px; top:' + top + 'px !important; background-color: #FFFFFF; border: solid 1px #267F30; padding: 0px; z-index:999} div.playerInfo {overflow: visible !important;} span.myht1 table>tr>td:hover { background-color:#C3E7C7 !important;}';
				// new
				var zaw = 'span.myht1 {position: relative} div.myht2 {display: none} span.myht1:hover div.myht2 {display: inline; width:maxwidth; position: absolute; left: 20px; top:' + top + 'px !important; background-color: #FFFFFF; border: solid 1px #267F30; padding: 0px; z-index:999} div.playerInfo {overflow: visible !important;} span.myht1 table>tr>td>a { font-weight:normal !important; text-decoration:underline !important; color: #3f7137 !important;} table>tr>td:hover { background-color:#C3E7C7 !important;} div.cfHeader {overflow: visible !important;}';
                style.appendChild(doc.createTextNode(zaw));
                head.appendChild(style);
                var aLinks = doc.getElementsByTagName('a'); //doc.links;
                for (var i=0; i<aLinks.length; i++) {
						
						if (aLinks[i].href.search(/ft_popuplink=true/i)!=-1) continue;  // don't add to own popup links

						var forumuserlink = redir_from_forum && aLinks[i].href.search(/Club\/Manager\/\?UserID=/i)!=-1 
															&& aLinks[i].parentNode.id.search(/foxtrick_alltidspan/i)==-1
															&& aLinks[i].parentNode.className!="cfUserInfo";
                        if ( (aLinks[i].href.search(/Club\/\?TeamID=/i) > -1  && !redir_from_forum) || forumuserlink) {
                                var sLink = aLinks[i]; 
                                var value = FoxtrickHelper.getTeamIdFromUrl(sLink.href);
								if (forumuserlink) value = FoxtrickHelper.getUserIdFromUrl(sLink.href);
                                
								var par = aLinks[i].parentNode;
                                
                                if (par.parentNode.parentNode.parentNode.tagName == "DIV" && par.parentNode.parentNode.parentNode.className == "subMenuBox"){
                                        continue;
                                }
                                if (par.parentNode.parentNode.tagName == "DIV" && par.parentNode.parentNode.className == "subMenuBox"){
                                        continue;
                                }
                                if (par.parentNode.tagName == "DIV" && par.parentNode.className == "boxLeft"){
                                        continue;
                                }
                                if (par.tagName == "DIV" && par.id == "teamLinks"){
                                        continue;
                                }
                                
                                var tbl = doc.createElement("table");
                                tbl.setAttribute("cell-padding", "2");
                                tbl.setAttribute("cell-spacing", "0");
                                
                                if (bMatches){
                                        var tr1 = doc.createElement("tr");
                                        tr1.setAttribute("height", "20");
                                        var td1 = doc.createElement("td");
                                        var a1 = doc.createElement("a");
                                        if (forumuserlink) a1.setAttribute('href', '/Club/Manager/?userId='+value+'&redir_to_matches=true'+'&ft_popuplink=true');
		                                else a1.setAttribute('href', '/Club/Matches/?TeamID=' + value+'&ft_popuplink=true');
                                        a1.appendChild(doc.createTextNode(Foxtrickl10n.getString( 'Matches' )));
                                        td1.appendChild(a1);
                                        tr1.appendChild(td1);
                                        tbl.appendChild(tr1);
                                }
                                
                                if (bPlayers){
                                        var tr2 = doc.createElement("tr");
                                        tr2.setAttribute("height", "20");
                                        var td2 = doc.createElement("td");
                                        var a2 = doc.createElement("a");
                                        if (forumuserlink) a2.setAttribute('href', '/Club/Manager/?userId='+value+'&redir_to_players=true'+'&ft_popuplink=true');
		                                else a2.setAttribute('href', '/Club/Players/?TeamID=' + value+'&ft_popuplink=true');
                                        a2.appendChild(doc.createTextNode(Foxtrickl10n.getString( 'Players' )));
                                        td2.appendChild(a2);
                                        tr2.appendChild(td2);
                                        tbl.appendChild(tr2);
                                }
                                                                
                                if (bLast5IPs){
                                        var tr3 = doc.createElement("tr");
                                        tr3.setAttribute("height", "20");
                                        var td3 = doc.createElement("td");
                                        td3.setAttribute("nowrap", "nowrap");
                                        var a3 = doc.createElement("a");
                                        if (forumuserlink) a3.setAttribute('href', '/Club/Manager/?userId=' + value+'&ShowOldConnections=true'+'&ft_popuplink=true');
                                        else a3.setAttribute('href', '/Club/Manager/?teamId=' + value+'&ShowOldConnections=true'+'&ft_popuplink=true');
                                        a3.appendChild(doc.createTextNode(Foxtrickl10n.getString( 'last_5_ips' )));
                                        td3.appendChild(a3);
                                        tr3.appendChild(td3);
                                        tbl.appendChild(tr3);
                                }
                                
                                if (bGuestbook){
                                        var tr4 = doc.createElement("tr");
                                        tr4.setAttribute("height", "20");
                                        var td4 = doc.createElement("td");
                                        td4.setAttribute("nowrap", "nowrap");
                                        var a4 = doc.createElement("a");
                                        if (forumuserlink) a4.setAttribute('href', '/Club/Manager/?userId='+value+'&redir_to_guestbook=true'+'&ft_popuplink=true');
		                                else a4.setAttribute('href', '/Club/Manager/Guestbook.aspx?teamid=' + value+'&ft_popuplink=true');
                                        a4.appendChild(doc.createTextNode(Foxtrickl10n.getString( 'Guestbook' )));
                                        td4.appendChild(a4);
                                        tr4.appendChild(td4);
                                        tbl.appendChild(tr4);
                                }       
								
                                if (bCoach){
                                        var tr5 = doc.createElement("tr");
                                        tr5.setAttribute("height", "20");
                                        var td5 = doc.createElement("td");
                                        td5.setAttribute("nowrap", "nowrap");
                                        var a5 = doc.createElement("a");
										if (forumuserlink) a5.setAttribute('href', '/Club/Manager/?userId='+value+'&redir_to_coach=true'+'&ft_popuplink=true');
		                                else {
											if (value!=ownteamid) {
												a5.setAttribute('href', '/Club/Players/?TeamID='+value+'&redir_to_coach=true'+'&ft_popuplink=true');}
											else {a5.setAttribute('href', '/Club/Training/?redir_to_coach=true'+'&ft_popuplink=true');}
											}
										a5.appendChild(doc.createTextNode(Foxtrickl10n.getString( 'Coach' )));										
                                        td5.appendChild(a5);
                                        tr5.appendChild(td5);
                                        tbl.appendChild(tr5);
									}
                                if (bTransferHistory){
                                        var tr7 = doc.createElement("tr");
                                        tr7.setAttribute("height", "20");
                                        var td7 = doc.createElement("td");
                                        td7.setAttribute("nowrap", "nowrap");
                                        var a7 = doc.createElement("a");
                                        if (forumuserlink) a7.setAttribute('href', '/Club/Manager/?userId='+value+'&redir_to_transferhistory=true'+'&ft_popuplink=true');
		                                else a7.setAttribute('href', '/Club/Transfers/transfersTeam.aspx?teamId=' + value+'&ft_popuplink=true');
        								a7.appendChild(doc.createTextNode(Foxtrickl10n.getString( 'TransferHistory' )));
                                        td7.appendChild(a7);
                                        tr7.appendChild(td7);
                                        tbl.appendChild(tr7);
                                }       
                                if (bLastLineup){
                                        var tr6 = doc.createElement("tr");
                                        tr6.setAttribute("height", "20");
                                        var td6 = doc.createElement("td");
                                        td6.setAttribute("nowrap", "nowrap");
                                        var a6 = doc.createElement("a");
                                        if (forumuserlink) a6.setAttribute('href', '/Club/Manager/?userId='+value+'&redir_to_lastlineup=true'+'&ft_popuplink=true');
										else a6.setAttribute('href', '/Club/Matches/MatchLineup.aspx?MatchID=&TeamID='+value+'&useArchive=True'+'&ft_popuplink=true');										
                                        a6.appendChild(doc.createTextNode(Foxtrickl10n.getString( 'LastLineup' )));
                                        td6.appendChild(a6);
                                        tr6.appendChild(td6);
                                        tbl.appendChild(tr6);
                                }
                                
								if (forumuserlink) {
									var span = doc.createElement("span");
									span.setAttribute('class', 'myht1');
									var div = doc.createElement("div");
									div.setAttribute('class', 'mainBox myht2');
									div.appendChild(tbl);
									par.insertBefore(span, aLinks[i]);
									span.appendChild(sLink);
									span.appendChild(div);
								
								}
                                else {
									var span = doc.createElement("span");
									span.setAttribute('class', 'myht1');
									var div = doc.createElement("div");
									div.setAttribute('class', 'mainBox myht2');
									div.appendChild(tbl);
									par.insertBefore(span, aLinks[i]);
									span.appendChild(sLink);
									span.appendChild(div);
								}
                        }
                }
        },
        
        change : function( page, doc ) {        
		},
        

        initOptions : function() {
                this.OPTIONS = new Array( "Matches" ,
                                          "Players" ,
                                          "last_5_ips" ,
                                          "Guestbook" ,
                                          "Coach",
                                          "TransferHistory" ,
										  "LastLineup" );
        }
};
