var fs = require('fs');
var util = require('util');
var moment = require('moment');

function getDay (data) {
    var day = data.children[0].children[0].children[0].data;
    day = day.match(/\d+/g)[0];
    return day;
}

function parseEvent (arr, day) {
    var event = {};
    event.desc = [];
    arr.forEach(function (data) {
	var str;
	if ('children' in data) {
	    str = data.children[0].data;
	} else {
	    str = data.data;
	}
	if (str.match(/(\d+)：(\d+)〜(\d+)：(\d+)/)) {
	    var bh = RegExp.$1;
	    var bm = RegExp.$2;
	    var eh = RegExp.$3;
	    var em = RegExp.$4;
	    event.begin = moment(util.format('%d-%d-%d %d:%d:00', year, month, day, bh, bm)).format();
	    event.end = moment(util.format('%d-%d-%d %d:%d:00', year, month, day, eh, em)).format();
	} else if (str.match(/【(.+)】/g)) {
	    event.title = RegExp.$1.trim();
	} else if (str === 'br' || str.trim() === '') {
	    return;
	} else {
	    event.desc.push(str.trim());
	}
    });
    return event;
}

var year;
var month;
var floors = ['B1', 'B2'];
for (year = 2007; year <= 2015; year++) {
    for (month = 1; month <= 12; month++) {
	floors.forEach(function (floor) {
	    var fname = util.format('../data/json/raw/%d-%d-%s.json', year, month, floor);
	    console.log(fname);
	    var text = fs.readFileSync(fname, 'utf-8');
	    var json = JSON.parse(text);
	    var html = json[0];
	    var body = html.children[2];
	    var center = body.children[1];
	    var table = center.children[10].children[0];
	    var trs = table.children.filter(function (tr) {
		return 'children' in tr;
	    });
	    trs.shift();
	    
	    var array = [];
	    trs.forEach(function (tr) {
		var tds = tr.children.filter(function (td) {
		    if (td.name === 'td' && 'children' in td) {
			return true;
		    }
		    return false;
		});
		array = array.concat(tds);
	    });
	    
	    array = array.map(function (x) {
		var obj = {};
		obj.day = getDay(x.children.shift());
		obj.events = [];


		x.children.forEach(function (child) {
		    var event;
		    if ('children' in child) {
			event = parseEvent(child.children, obj.day);
			obj.events.push(event);
		    } else {
			// do nothing
		    }
		    
		    //obj.data.push(child);
		});
		return obj;
	    });

	    var json = JSON.stringify(array, null, 2);
	    console.log(json);
	    fs.writeFileSync(util.format('../data/json/extract/%d-%d-%s.json', year, month, floor), json);
	});
    }
}
