// Require base scripts
	var base_curate = require("./curate.js")
	var cronJob = require('cron').CronJob

// Run the cron job
	new cronJob('0 40 22 * * *', function(){
		base_curate.bubble_curate()
	}, null, true)
