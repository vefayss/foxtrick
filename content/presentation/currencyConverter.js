// script which converting a currency on the all hattrick pages
// Note dev: only if currency in TD tag and in div[id=page]
// author by smates

FoxtrickCurrencyConverter = {

    MODULE_NAME : "CurrencyConverter",
    MODULE_CATEGORY : Foxtrick.moduleCategories.PRESENTATION,
    DEFAULT_ENABLED : false,

    init : function() {
        Foxtrick.registerPageHandler('all_late', this);
    },

    run : function(page, doc) {
    
    /*CURRENCY TYPE AND RATE*/
  
	var oldCurrencySymbol = FoxtrickPrefs.getString("oldCurrencySymbol");//currencysymbol which in the your country
	var oldSymbolLength = oldCurrencySymbol.length;
	var currencySymbol = FoxtrickPrefs.getString("currencySymbol");//
	var currencyRate = FoxtrickPrefs.getString("currencyRate"); // this is value of tag CODE from htcurrency.xml
	var currencyRateNewCurr = FoxtrickPrefs.getString("currencyRateTo");
	var myReg = new RegExp('(-\\d+|\\d+)'+oldCurrencySymbol);
	var myDelReg = new RegExp('(-\\d+|\\d+)'+oldCurrencySymbol+'|<.+>');   
   
   
    // near all currencies are im tables
   	this.drawNewCurrency(doc, 'td',  oldCurrencySymbol, oldSymbolLength, currencySymbol,currencyRate, currencyRateNewCurr, myReg, myDelReg);                 
	// some might be in alert boxes which use <p>
    this.drawNewCurrency(doc, 'p',  oldCurrencySymbol, oldSymbolLength, currencySymbol,currencyRate, currencyRateNewCurr, myReg, myDelReg);                 
    },

	change : function( page, doc ) {
	},

	
	drawNewCurrency : function (doc, tagname, oldCurrencySymbol, oldSymbolLength, currencySymbol, currencyRate, currencyRateNewCurr, myReg, myDelReg) {
	try {	
		var div = doc.getElementById( 'page' );
		var table_elm = div.getElementsByTagName( tagname );
   		for ( var i = 0; i < table_elm.length; i++) {
			if (table_elm[i].getElementsByTagName(tagname).length!=0) continue;  // don't do nested. only most inner gets converted
			
            var pos = table_elm[i].innerHTML.search(oldCurrencySymbol);
			if (pos > 0 && table_elm[i].id != "foxtrick-currency-converter"){
				var table_inner = Foxtrick.trim(table_elm[i].innerHTML);
				
				res="";
				var only_one_number=false; 
				var first=true;
				while (pos!=-1) { pos+=oldSymbolLength;
					var table_inner_stripped = table_elm[i].innerHTML.replace(/\s|\&nbsp\;/g,''); 					
					if (first==true && table_inner_stripped.replace(myDelReg,'')=='') only_one_number=true; // remove html tags and currency to check if this is the only real entry. 
					try {
						var val=table_inner_stripped.match(myReg)[1]; 					
					}
					catch (e){return;} // catching currency symbol of tranfer bid
					var conv = ReturnFormatedValue(Math.floor(val * currencyRate / currencyRateNewCurr),'&nbsp;');
					conv = conv.replace(/\-\&nbsp\;/,'-'); 
					
					// add a <b> if there is onyl one entry
					var br='';
					if (only_one_number==true) br='<br>';
					// add a space at the end if the next symbol is not ')'
					var space=' ';
					var next_char=table_elm[i].innerHTML.charAt(pos);
					if (next_char==')' || next_char=='/' || next_char=='.' || next_char==',') space='';
					if (table_elm[i].innerHTML.charAt(pos)=='<') {
						next_char=table_elm[i].innerHTML.substr(pos).replace(myDelReg,'').charAt(0);
						if (next_char==')' || next_char=='/' || next_char=='.' || next_char==',') space='';
					}
					// std color green. but use color of span if there is one. 
					var color='#377f31';
					if (table_elm[i].firstChild && table_elm[i].firstChild.style) {
						color = table_elm[i].firstChild.style.color;	
					}
					if (conv.charAt(0)=='-') color='#aa0000';   // neg number red
					if (val==0)  color="black";					// zero black
			
					// add left part plus converted 
					res+=table_elm[i].innerHTML.substr(0,pos)+' '+br+'<span class="smallText" style="font-weight: normal; color:'+color+';white-space: nowrap;">('+conv+'&nbsp;'+currencySymbol+')</span>'+space; 
					
					// get the remains and check them in next loop
					table_elm[i].innerHTML = table_elm[i].innerHTML.substr(pos);		   
					pos= table_elm[i].innerHTML.search(oldCurrencySymbol);	
					first=false;			
				}
				table_elm[i].innerHTML=res+table_elm[i].innerHTML;
		
				table_elm[i].id="foxtrick-currency-converter";
			}
		}
    }
    catch(e) {dump('    >' + e + '\n');} 
    }  
};