var exec = require('child_process').exec;
var async = require('async');

var next = function(callback) {
	return function(error, stdout, stderr) {
		if (stderr) {
			callback(new Error(stderr));
		}
		console.log(stdout);
		callback(null);
	};
};

async.waterfall([

	function(callback) {
		exec('jekyll build', next(callback));
	},
	function(callback) {
		exec('cd _site', next(callback));
	},
	function(callback) {
		exec('git init', next(callback));
	},
	function(callback) {
		exec('git add .', next(callback));
	},
	function(callback) {
		exec('git init', next(callback));
	},
	function(callback) {
		exec('git commit -m "Site updated at ' + Date.now + '"', next(callback));
	},
	function(callback) {
		exec('git remote add origin git@github.com:SPF-Team/SPF-Team.github.io.git', next(callback));
	},
	function(callback) {
		exec('git push origin master:refs/heads/master --force', next(callback));
	}
], function(err) {
	if (err) {
		console.log(err.message);
	}
	console.log("All done!");
});