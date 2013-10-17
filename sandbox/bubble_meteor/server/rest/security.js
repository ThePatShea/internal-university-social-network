this.UserType = {
  ADMIN: '3',
  SUPERADMIN: '4'
};

this.RestSecurity = {
  // Posts
  filterBubblePosts: function(ctx) {
    return {
      bubbleId: {$exists: false}
    };
  },

  postCheck: function(ctx, obj) {
    if (obj && obj.bubbleId)
      return RestHelpers.jsonResponse(401, 'Bubble posts are disallowed');
  },

  // Explores
  isUniqueExplore: function(ctx, obj) {
    if (!obj.title || !obj.title.length)
      return RestHelpers.jsonResponse(422, 'Please fill in a headline');

    if (RestHelpers.mongoFindOne(Bubbles, {title: obj.title}))
      return RestHelpers.jsonResponse(302, 'This explore has already been created');
  },

  ownsExplore: function(ctx, obj) {
    // TODO: Fix me
    return true;
  },

  isExploreAdmin: function(ctx, obj) {
    if (ctx.user.userType != UserType.ADMIN)
      return RestHelpers.jsonResponse(401, 'Not admin');
  },

  // Bubbles
  isUniqueBubble: function(ctx, obj) {
    if (!obj.title || !obj.title.length)
      return RestHelpers.jsonResponse(422, 'Please fill in a headline');

    if (RestHelpers.mongoFindOne(Bubbles, {title: obj.title}))
      return RestHelpers.jsonResponse(302, 'This bubble has already been created');
  },

  isConnectedToBubble: function(ctx, obj) {
    if (ctx.user.userType == UserType.ADMIN)
      return;

    var bubble = RestHelpers.mongoFindOne(Bubbles, obj.id)

    if (bubble.users) {
      if (_.contains(bubble.users.applicants, ctx.userId) ||
          _.contains(bubble.users.invitees, ctx.userId) ||
          _.contains(bubble.users.members, ctx.userId) ||
          _.contains(bubble.users.admins, ctx.userId))
        return;
    }

    return RestHelpers.jsonResponse(401, 'Not connected to bubble');
  },

  ownsBubble: function(ctx, obj) {
    if (ctx.user.userType == UserType.ADMIN)
      return;

    if (obj.users && obj.users.admins && _.contains(obj.users.admins, ctx.userId))
      return;

    return RestHelpers.jsonResponse(401, 'Not bubble owner');
  },

  // Bubble posts
  makeBubblePostFilter: function(name) {
    return function(ctx, query) {
      query['postType'] = name;
      return query;
    };
  },

  makeBubblePostCheck: function(name) {
    return function(ctx, obj) {
      if (obj && obj.postType != name)
        return RestHelpers.jsonResponse(401, 'Invalid post type');
    };
  },

  // Comments
  canCreateComment: function(ctx, obj) {
    if (!obj.postId)
      return RestHelpers.jsonResponse(422, 'Please comment on post');

    var post = RestHelpers.mongoFindOne(Posts, obj.postId);
    if (!post)
      return RestHelpers.jsonResponse(422, 'Please comment on post');
  },

  canChangeComment: function(ctx, obj) {
    if (!obj.postId)
      return RestHelpers.jsonResponse(422, 'Please comment on post');

    var post = RestHelpers.mongoFindOne(Posts, obj.postId);
    if (!post)
      return RestHelpers.jsonResponse(422, 'Please comment on post');

    if (!obj.bubbleId)
      return RestHelpers.jsonResponse(422, 'Can only comment bubble posts');

    var bubble = RestHelpers.mongoFindOne(Bubbles, obj.bubbleId);
    if (!bubble)
      return RestHelpers.jsonResponse(422, 'Can only comment bubble posts');

    var admins = bubble.users.admins;
    if (_.contains(bubble.users.admins, ctx.userId))
      return;

    if (post.userId == ctx.userId)
      return;

    return RestHelpers.jsonResponse(401, 'Can not edit others comment')
  }
};