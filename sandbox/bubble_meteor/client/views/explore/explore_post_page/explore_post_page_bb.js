Template.explorePostPageBB.helpers({
  getCurrentPost: function() {
    return Session.get('currentExplorePost');
  },
  getPostAsBubbleCategory: function() {
    var postBubble = Session.get('currentExplorePostBubble');
    if (postBubble) {
      return postBubble.category;
    }
    else
    {
      return -1;
    }
  },
  bubbleName: function() {
    var postBubble = Session.get('currentExplorePostBubble');
    if (postBubble) {
      return postBubble.title;
    } else {
      // TODO: Fix me
      return 'a bubble';
    }
  },
  postedAsUser: function() {
    return this.postAsType === 'user';
  },
  postedAsBubble: function() {
    return this.postAsType === 'bubble';
  },
  displayName: function() {
    return this.author;
    /*
    if (this.postAsType === 'user') {
      return this.author;
    } else
    if (this.postAsType === 'bubble') {
      var bubble = Session.get('currentExplorePostBubble');
      if (bubble)
        //return bubble.get('title');
      return bubble.title;
      else
        return this.author;
    }
    */
  },
  isFlagged: function() {
    return this.flagged;
  },
  getAuthorProfilePicture: function() {
    // TODO: Use REST API
    var user = Meteor.users.findOne(this.userId);
    return user && user.profilePicture;
  },

  notEvent: function() {
    return this.postType !== 'event';
  },

  isEvent: function() {
    return this.postType === 'event';
  },

  isDiscussion: function(){
    return this.postType === 'discussion';
  },

  currentExplore: function(){
    return Session.get('currentExploreInfo');
  }
});

Template.explorePostPageBB.events({
  'click .btn-flag': function() {
    //Google Analytics
    _gaq.push(['_trackEvent', 'Flagging', 'Flag', +this.name]);

    // TODO: Use REST?
    if (confirm("Flagging a post will report it to Bubble moderators as inappropriate. Are you sure you want to flag this post?")) {
      var flagAttributes = {
        postId: this._id,
        bubbleId: this.bubbleId,
        invokerId: Meteor.userId(),
        invokerName: Meteor.user().username,
      }
      Meteor.call('createFlag',flagAttributes);
    }
  },
  'click .btn-delete': function(e) {
    //Google Analytics
      _gaq.push(['_trackEvent', 'Post', 'Delete Discussion', this.name]);

    e.preventDefault();
    if (confirm("Are you sure you want to delete this post?")) {
      var currentPostId = Session.get('currentPostId');
      Posts.remove(currentPostId, function(){
        var displayPostConfirmationMessage = function(){
          return function(){
            $('.job-type').text("This post will be deleted shortly!");
            $('.message-container').removeClass('visible-false');
            $('.message-container').addClass('message-container-active');
            setTimeout(function(){
              $('.message-container').removeClass('message-container-active');
              $('.message-container').addClass('visible-false');
              clearTimeout();
            },10000);
          }
        }
        setTimeout(displayPostConfirmationMessage(), 1000);
        //window.location.href = "/explore/"+Session.get('currentExploreId')+"/home";
        Meteor.Router.to("/explore/"+Session.get('currentExploreId')+"/home");
      });
    }
  }
});


function refreshData(template, exploreId, postId) {
  if (!postId)
    return;

  LoadingHelper.start();

  var pageData = template.pageData = new ExploreData.ExplorePostPage(exploreId, postId, function() {
    Session.set('currentExploreInfo', pageData.getExplore());
    Session.set('currentExplorePost', pageData.getPost());
    Session.set('currentExplorePostBubble', pageData.getBubble());

    LoadingHelper.stop();
  });

  if (template.commentSub)
    template.commentSub.stop();

  template.commentSub = Meteor.subscribe('comments', postId);
}

Template.explorePostPageBB.created = function() {
  var that = this;

  Session.set('currentExplorePost', null);
  Session.set('currentExploreInfo', null);
  Session.set('currentExplorePostBubble', null);

  this.watch = Meteor.autorun(function() {
    refreshData(that, Session.get('currentExploreId'), Session.get('currentPostId'));
  });
};

Template.explorePostPageBB.rendered = function() {
  var that = this;

  // Attach custom event handler
  $('#explore-post-page').off('postGoing').on('postGoing', function(e, postId) {
    that.pageData.toggleGoing(Meteor.userId());
    Session.set('currentExplorePost', that.pageData.getPost());
  });
};

Template.explorePostPageBB.destroyed = function() {
  this.watch.stop();

  if (this.commentSub)
    this.commentSub.stop();
};
