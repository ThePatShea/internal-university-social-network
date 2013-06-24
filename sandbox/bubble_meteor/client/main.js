// postsHandle = Meteor.subscribeWithPagination('posts');

commentsHandle = Meteor.subscribeWithPagination('comments',10);
mainBubblesHandle = Meteor.subscribeWithPagination('bubbles',3);
eventListHandle = Meteor.subscribeWithPagination('events',3);
discussionListHandle = Meteor.subscribeWithPagination('discussions',3);
fileListHandle = Meteor.subscribeWithPagination('files',3);

Deps.autorun(function() {
	//Retrieves Bubbles
  Meteor.subscribe('singleBubble', Session.get('currentBubbleId'));
  Meteor.subscribe('invitedBubbles', Meteor.userId());
  joinedBubblesHandle = Meteor.subscribeWithPagination('joinedBubbles', Meteor.userId(), 4);

  
  Meteor.subscribe('singlePost', Session.get('currentPostId'));
  Meteor.subscribe('comments', Session.get('currentPostId'));

  //Retrieves Users
	Meteor.subscribe('relatedUsers', Session.get('currentBubbleId'), Session.get('currentPostId'));
	searchedUsersHandle = Meteor.subscribeWithPagination('findUsersByName', Session.get('selectedUsername'), 4);
})

Meteor.subscribe('updates');