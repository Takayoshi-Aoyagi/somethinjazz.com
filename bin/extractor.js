var fs = require('fs');
var util = require('util');
var moment = require('moment');

var year = 2015;
var month = 4;
var fname = util.format('../data/json/%d-%d-B1.json', year, month);
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

console.log(JSON.stringify(array, null, 2));
