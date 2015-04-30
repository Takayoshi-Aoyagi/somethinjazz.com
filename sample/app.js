var app = app || {};

(function () {

    function formatDate(begin, end) {
	return moment(begin).format("HH:mm") + "-" + moment(end).format("HH:mm");;
    }

    app.DailyView = Backbone.View.extend({
	el: '#daily',

	getData: function (day, callback) {
	    index = day -1;
	    async.parallel([
		function (cb) {
		    var params = {
			url: "../data/json/extract/2015-4-B1.json"
		    };		
		    AjaxUtils.get(params, function (err, data) {
			cb(err, data[index]);
		    });
		},
		function (cb) {
		    var params = {
			url: "../data/json/extract/2015-4-B2.json"
		    };		
		    AjaxUtils.get(params, function (err, data) {
			cb(err, data[index]);
		    });
		}
	    ], function (err, results) {
		var json = [];
		console.log(results);
		results[0].events.forEach(function (data) {
		    var event = [formatDate(data.begin, data.end), data.title, 'B1'];
		    json.push(event);
		});
		results[1].events.forEach(function (data) {
		    var event = [formatDate(data.begin, data.end), data.title, 'B2'];
		    json.push(event);
		});
		callback(err, json);
	    });
	},
	
	render: function () {
	    var that = this;
	    that.$el.append('<p>Today\'s Schedule</p>');
	    that.$el.append('<table id="daily_schedule"></table>');
	    that.getData(1, function (err, json) {
		if (err) {
		    console.log(err);
		}
		$("#daily_schedule").dataTable({
		    data: json,
		    paging: false,
		    ordering: false,
		    info: false,
		    search: false,
		    "columns": [
			{"title": "date"},
			{"title": "name"},
			{"title": "floor"}
		    ]
		});
	    });
	}
    });

    app.init = function () {
	var dailyView = new app.DailyView();
	dailyView.render();
    };
}());
