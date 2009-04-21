/**
 * Colors the player name in the match report.
 *  * @author tychobrailleur & Stephan57
 */

FoxtrickMatchPlayerColouring = {
	MODULE_NAME : "MatchPlayerColouring",
	MODULE_CATEGORY : Foxtrick.moduleCategories.MATCHES,
	DEFAULT_ENABLED : true,
	OPTION_TEXTS : true,
	OPTION_TEXTS_DEFAULT_VALUES : new Array("background:#c3d9ff; color:black;", //My team
											"background:white; color:black;", //Home
                                            "background:black; color:white;" //Away
											),
	OPTIONS : new Array("My Team", "Home", "Away"),
						
    UNKNOWN_COLOUR : "#F0F0F0",
	
	init : function() {
        Foxtrick.registerPageHandler( "match",
                                      FoxtrickMatchPlayerColouring );
    },
    
    run : function( page, doc ) {
        
		var isarchivedmatch = (doc.getElementById("ctl00_CPMain_lblMatchInfo")==null);
		if (!isarchivedmatch) return;
		
		//Retrieve teams id
		var myTeamId=FoxtrickHelper.findTeamId(doc.getElementById('teamLinks'));
		var table = doc.getElementById('mainBody').getElementsByTagName('table')[0];
		var HomeTeamId=FoxtrickHelper.findTeamId(table.rows[0].cells[1]);
		var AwayTeamId=FoxtrickHelper.findTeamId(table.rows[0].cells[2]);
		
		//dump ('ownteam: '+myTeamId+'\n');
		//dump ('HomeTeamId: '+HomeTeamId+'\n');
		//dump ('AwayTeamId: '+AwayTeamId+'\n');
		
		//Retrieve colour parameters
		if (Foxtrick.isModuleFeatureEnabled( this, "My Team")) {
            var stlMyTeam = FoxtrickPrefs.getString("module." + this.MODULE_NAME + "." + "My Team_text");
            if (!stlMyTeam) stlMyTeam = this.OPTION_TEXTS_DEFAULT_VALUES[0];
		}
		if (Foxtrick.isModuleFeatureEnabled( this, "Home")) {
            var stlTeamA = FoxtrickPrefs.getString("module." + this.MODULE_NAME + "." + "Home_text");
            if (!stlTeamA) stlTeamA = this.OPTION_TEXTS_DEFAULT_VALUES[1];
        }
 		if (Foxtrick.isModuleFeatureEnabled( this, "Away")) {
            var stlTeamB = FoxtrickPrefs.getString("module." + this.MODULE_NAME + "." + "Away_text");
            if (!stlTeamB) stlTeamB = this.OPTION_TEXTS_DEFAULT_VALUES[2];
        }
	
		//Replace myTeam colour
		if (HomeTeamId == myTeamId) stlTeamA = stlMyTeam;
		else if (AwayTeamId == myTeamId) stlTeamB = stlMyTeam;
				
        var content_div = doc.getElementById('content');
        if (content_div == null) return;
        var teamA = "";
        var teamB = "";
        var content = content_div.getElementsByTagName("h1")[0].parentNode.innerHTML;;
		
		// get part between fisrt '.' after formation and end of paragraph
		var contentA = content.substring(0,content.search('.<br><br>'));		
		contentA=contentA.substring(contentA.search(/\d-\d-\d/));
		contentA=contentA.substring(contentA.indexOf('.'));
		//dump('A: ' + contentA+'\n------\n'+contentA.indexOf('.')+'\n');

        // get part between fisrt '.' after formation and end of paragraph
		var contentB = content.substring(content.search('.<br><br>')+9); 
		contentB=contentB.substring(0,contentB.search('.<br><br>')); 
		contentB=contentB.substring(contentB.search(/\d-\d-\d/));
		contentB=contentB.substring(contentB.indexOf('.')); 
		//dump('B: '+ contentB+'\n--------\n');

		var num_unknown_namesA=0;
        var FirstTeam = true; 
        if (contentA) {
            teamA = contentA.replace(/ \- /g, ", ").split(", ");
        }
		if (teamA[0].search(':')!=-1) teamA[0]=teamA[0].substring(teamA[0].search(':')+2);
		else teamA[0]=teamA[0].substring(teamA[0].lastIndexOf(' ')+1);
		for (var k=0;k<teamA.length;k++) { 
			if (teamA[k]=='') {++num_unknown_namesA;teamA[k]='##################'; }// replace empty string with something which will not be found in text again
			//dump(k+1+': "'+teamA[k]+'"\n');
		}
		var num_unknown_namesB=0;
        if (contentB) {
            teamB = contentB.replace(/ \- /g, ", ").split(", ");
        }
		if (teamB[0].search(':')!=-1) teamB[0]=teamB[0].substring(teamB[0].search(':')+2);
		else teamB[0]=teamB[0].substring(teamB[0].lastIndexOf(' ')+1);
 		for (var k=0;k<teamB.length;k++) { 
			if (teamB[k]=='') {++num_unknown_namesB;teamB[k]='##################'; } // replace empty string with something which will not be found in text again
			//dump(k+1+': "'+teamB[k]+'"\n');
		}		
		//Retrieve substitutions
		 var spans = content_div.getElementsByTagName("td");
		 for (var i=0; i<spans.length; i++) {
			var span_a = spans[i].getElementsByTagName("a");
			var span_img = spans[i].getElementsByTagName("img");
			for (var j=0; j<span_img.length; j++) {
				if (span_img[j].src.search(/sub_out/)!=-1) {
				//if (FoxtrickMatchPlayerColouring._isLinkPlayer(span_a[j].href)) {
					if (span_a[j].id == "") {
                        try { 
                            //Player Out
                            var PlayerOut = span_a[0].textContent;
                            var PlayerOut = PlayerOut.substr(PlayerOut.search(" ")+1);
                            //dump('sub out:'+j+' '+span_a[0].textContent+' = '+PlayerOut+'\n');
							//Player In
							var PlayerIn = span_a[1].textContent;
                            var PlayerIn = PlayerIn.substr(PlayerIn.search(" ")+1);
                            //dump('sub in:'+j+' '+' '+span_a[1].textContent+' = '+PlayerIn+'\n');
                            //Add Player In to the players list
							//dump (j+' '+teamA.length+' '+teamB.length+'\n');
							for (var k=0;k<teamA.length;k++) { //dump(k+' '+teamA[k]+' '+PlayerOut+'\n');
							if (PlayerOut.search(teamA[k])!=-1) 
								{teamA.push(PlayerIn);break;}
							}
							for (var k=0;k<teamB.length;k++)  { //dump(k+' '+teamB[k]+' '+PlayerOut+'\n');
							if (PlayerOut.search(teamB[k])!=-1) {teamB.push(PlayerIn);break;}
							}
							
                        }
                        catch(e) {
                            dump('FoxtrickMatchPlayerColouring => Substitution=> ' + e);
                        }
					}
				}
			}
		 }		 
 
		var links = content_div.getElementsByTagName("a");
		 for (var i=0; i<links.length; i++) {
             if (FoxtrickMatchPlayerColouring._isLinkPlayer(links[i].href)) {
                 links[i].style.border = "1px solid #ccc";
				 links[i].style.padding = "0px 2px";
  				 var playerFullName = links[i].textContent;
				 if  (playerFullName.charAt(0)==" ") playerFullName = playerFullName.substr(1);
				 var b = playerFullName.search(" ");
				 var l = playerFullName.length;
				 if (b>=0) {
					var playerName = playerFullName.substr(b+1,l-b+1);
				 } else {
					var playerName = playerFullName;
				 }
				//playerName=links[i].textContent; 
				var foundA =false;
				for (var k=0;k<teamA.length;k++) { //dump(teamA[k]+' '+playerName.indexOf(teamA[k])+'\t');
					if (playerName.indexOf(teamA[k])>-1) foundA=true; 
				}
				var foundB =false;
				for (var k=0;k<teamB.length;k++) { //dump(teamB[k]+' '+playerName.indexOf(teamB[k])+'\t');
					if (playerName.indexOf(teamB[k])>-1) foundB=true; 
				}
                if (foundA && !foundB || (!foundA && !foundB && num_unknown_namesA>0 && num_unknown_namesB==0)) {
					links[i].setAttribute("style", stlTeamA + 'border:1px solid #ccc;padding:0px 2px;'); 
                } 
				else if (foundB && !foundA || (!foundA && !foundB && num_unknown_namesA==0 && num_unknown_namesB>0)) {
					links[i].setAttribute("style", stlTeamB + 'border:1px solid #ccc;padding:0px 2px;'); 
                 }    
                else {
                    links[i].style.backgroundColor = FoxtrickMatchPlayerColouring.UNKNOWN_COLOUR;
                 }
				 //dump('\np: "'+ playerName+'" A: '+foundA+' B: '+foundB+'\n');
             } 
			 //Colors the name of the teams  on the right box like the players
			 else { 
			     if (FoxtrickMatchPlayerColouring._isLinkTeam(links[i].href)) {
					 if (links[i].parentNode.parentNode.parentNode.parentNode.tagName=="TBODY") {
						links[i].style.border = "1px solid #ccc";
						links[i].style.padding = "0px 2px";
						if (FirstTeam) {
							links[i].setAttribute("style", stlTeamA + 'border:1px solid #ccc;padding:0px 2px;'); 
 							FirstTeam = false;
						}
						else {
							links[i].setAttribute("style", stlTeamB + 'border:1px solid #ccc;padding:0px 2px;'); 
						}
					 }
				}
			 }
         }
    },

    change : function(url) {
        
    },        
    
    _isLinkPlayer : function(url) {
        if (url) {
            return url.match(/Player\.aspx/);
        }
        return false;
    },

	_isLinkTeam : function(url) {
        if (url) {
            return url.match(/Club\/\?TeamID=/i);
        }
        return false;
    }
};