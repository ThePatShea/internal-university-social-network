if(!Meteor.users.findOne({username:'campusbubble'})){
	Accounts.createUser({
		username:'campusbubble',
		email:'development@thecampusbubble.com',
		password:'F302pinpulse'
	});
}

if(!Meteor.users.findOne({username:'emorybubble'})){
	Accounts.createUser({
		username:'emorybubble',
		email:'support@emorybubble.com',
		password:'F302pinpulse'
	});
}

/*
for (var n = 0; n < 100; ++n) {
	var name = 'mark' + n;

	if(!Meteor.users.findOne({username:name})){
		Accounts.createUser({
			username: name,
			profile: {
				name: name,
			},
			email:name+'@emorybubble.com',
			password: '1'
		});
	}
}
*/

// if (Meteor.isServer) {
//   Meteor.startup(function () {
// 		Meteor.headly.config({tagsForRequest: function(req) {
// 		  return '<meta property="og:image" content="https://bubble.meteor.com/img/facebook.gif">' +
// 					    '<meta property="og:url" content="https://bubble.meteor.com">' +
// 					    '<meta property="og:title" content="Emory Bubble">';
// 		}});
// 	});
// 	// process.env.MONGO_URL = 'mongodb://haopjh:haopjh@dharma.mongohq.com:10032/bubbletest';
// 	// console.log(this.process.env);
// }
