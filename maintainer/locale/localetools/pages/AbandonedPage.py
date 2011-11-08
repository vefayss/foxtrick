import localetools.l10n
import localetools.utils.markup
import localetools.utils.ensuredirectory

def getPageString(locale, master, revision):
	if not locale or not master:
		return

	columns = ["locale","entry","line"]
	text = {"locale":"Locale", "entry":"Entry", "line":"Found in locale"}

	table = localetools.utils.markup.page( )
	table.init( title="FoxTrick r"+ str(revision) + " Localization Statistics",
			   css=('./../style.css'), 
			   script=([['./../jquery-latest.js','javascript'],[ './../jquery.tablesorter.js','javascript']]))
				   

	table.table.open(id="mytable", _class="tablesorter")
	table.thead.open()
	for c in columns:
		table.th(text[c])
	table.thead.close()
	table.tbody.open()

	abandoned = locale.getAbandoned()
	for a in abandoned:
		table.tr.open()
		table.td(locale.getShortName())
		table.td(a.getKey())
		table.td(a.getLine()+1)
		table.tr.close()

	table.tbody.close()
	table.table.close()
	table.script("$(document).ready(function(){$(\"#mytable\").tablesorter();});", type="text/javascript")
	table.script.close()
	return str(table)
	
	
#this also reads all locales, but wont analize anything
#analization is done when info about missing/abandoned etc. is requested for the first time

def create(locales, revision, outdir):
	print "Generating abandoned-pages for r" + str(revision)
	if isinstance(locales, localetools.l10n.foxtrickLocalization):
		for loc in locales.getAll():
			if not loc.getAbandonedCount():
				print "No abandoned entries for locale: " + loc.getShortName() + " ... skipping file creation"
				continue
				
			localetools.utils.ensuredirectory.ensure(outdir +"/"+ str(revision))
			page = getPageString(loc, locales.getMaster(), revision)
			file = open(outdir +"/"+ str(revision)+ "/" + loc.getShortName() + "_abandoned.html","w+")
			file.write(page)
			file.close()
	else:
		raise TypeError, "You beed to pass an instance of localetools.l10n.foxtrickLocalization"