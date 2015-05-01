var app = app || {};

(function () {

    function formatDate(date) {
	return moment(date).format("HH:mm");
    }

    app.DailyView = Backbone.View.extend({
	el: '#daily',

	getData: function (callback) {
	    var ymd = this.date.split('/'),
		year = ymd[0],
		month = ymd[1],
		day = ymd[2],
		index = day -1;
	    async.parallel([
		function (cb) {
		    var params = {
			url: sprintf("../data/json/extract/%d-%d-B1.json", year, Number(month)),
			datatype: "json"
		    };		
		    AjaxUtils.get(params, function (err, data) {
			if (typeof data === 'string') {
			    data = JSON.parse(data);
			}
			cb(err, data[index]);
		    });
		},
		function (cb) {
		    var params = {
			url: sprintf("../data/json/extract/%d-%d-B2.json", year, Number(month)),
			datatype: "json"
		    };		
		    AjaxUtils.get(params, function (err, data) {
			if (typeof data === 'string') {
			    data = JSON.parse(data);
			}
			cb(err, data[index]);
		    });
		}
	    ], function (err, results) {
		var json = [];
		results[0].events.forEach(function (event) {
		    event.floor = 'B1';
		    json.push(event);
		});
		results[1].events.forEach(function (event) {
		    event.floor = 'B2';
		    json.push(event);
		});
		var prevPhoto;
		json.forEach(function (data) {
		    if (data.title.indexOf("セッション") != -1) {
			data.photo = "http://miles.sakura.ne.jp/img/image.png";
		    } else {
			data.desc.forEach(function (str) {
			    if (str.match(/img src=\"(http.+)\" .+/g)) {
				data.photo = RegExp.$1;
				prevPhoto = data.photo;
			    }
			});
		    }
		    if (!data.photo) {
			data.photo = prevPhoto;
			if (!data.photo) {
			    data.photo = "http://www.somethinjazz.com/img/logo170.jpg"
			}
		    }
		});
		callback(err, json);
	    });
	},

	initialize: function () {
	    var that = this,
		m = moment();
	    $.datepicker.setDefaults($.datepicker.regional['ja']);
	    $("#date_picker").datepicker();
	    $("#date_picker").datepicker("option", "dateFormat", 'yy/mm/dd');
	    $("#date_picker").datepicker("option", "onSelect", function (x) {
		that.date = x;
		that.render();
	    });
	    this.date = sprintf('%s/%s/%s', m.year(), m.month() + 1, m.date());
	},
	
	render: function () {
	    var that = this;
	    that.getData(function (err, events) {
		var html, color;
		if (err) {
		    console.log(err);
		}
		html = '<ul data-role="listview" data-inset="true">';
		events.forEach(function (event) {
		    color = event.floor === 'B1' ? 'BLUE' : 'RED';
		    html += '<li>'
		    html += sprintf('<a href="%s">', '#');
		    html += sprintf('<img src="%s">', event.photo);
		    html += sprintf('<h2>%s</h2>', event.title);
		    html += sprintf('<p><font color="%s">%s</font> %s-%s</p>',color,  event.floor, formatDate(event.begin), formatDate(event.end));
		    html += '</li>'
		});
		html += '</ul>';
		$("#daily_schedule").html(html).trigger('create');
	    });
	}
    });

    app.init = function () {
	var dailyView = new app.DailyView();
	dailyView.render();

	$(".ui-navbar li").click(function (x,y,z) {
	    console.log(x);
	});
    };
}());
