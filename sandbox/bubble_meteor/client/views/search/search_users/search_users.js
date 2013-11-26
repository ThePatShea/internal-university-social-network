Template.searchUsers.events({
  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    if(!DisplayHelpers.isMobile()) {
      SearchHelpers.searchUsersMeteor(searchText, function(err, res) {
        if (!err)
          Session.set('selectedUserList', res);
      });
    }
    LoadingHelper.stop();
  },

  'click .search-btn': function(evt) {
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    SearchHelpers.searchUsersMeteor(searchText, function(err, res) {
      if (!err)
        Session.set('selectedUserList', res);
    });
    LoadingHelper.stop();
  }
});



Template.searchUsers.helpers({
  getSearchedUsers: function() {
    return Session.get('selectedUserList');
  },
  typing: function() {
    return Session.get("typing");
  }
});



Template.searchUsers.created = function() {
  Session.set("selectedUserList", []);
}



Template.searchUsers.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'users');
  $(document).attr('title', 'Search Users - Emory Bubble');
}


