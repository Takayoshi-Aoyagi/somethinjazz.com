var fs = require('fs');
var util = require('util');
var htmlparser = require("htmlparser");

var handler = new htmlparser.DefaultHandler(function (error, dom) {
    if (error) {
	//[...do something for errors...]
    } else {
	//[...parsing done, do something...]
    }
});
var parser = new htmlparser.Parser(handler);

var year, month, html, json, floor
    floors = ['B1', 'B2'];
for (year = 2007; year <= 2015; year++) {
    for (month = 1; month <= 12; month++) {
	floors.forEach(function (floor) {
	    html = fs.readFileSync(util.format('../data/html/utf8/%d-%d-%s.html', year, month, floor));
	    parser.parseComplete(html);
	    json = JSON.stringify(handler.dom, null, 2);
	    fs.writeFileSync(util.format('../data/json/raw/%d-%d-%s.json', year, month, floor), json);
	});
    }
}	
