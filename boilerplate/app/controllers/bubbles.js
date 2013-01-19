var mongoose = require('mongoose')
  , Bubble = mongoose.model('Bubble')
  , _ = require('underscore')


// New bubble
exports.new = function(req, res){

  var current_year = new Date().getFullYear();

  res.render('bubbles/new', {
      title: 'Create a Bubble'
    , current_year: current_year
    , sidebar_name: 'Create'
    , bubble: new Bubble({})
  })
}


// Create a bubble
exports.create = function (req, res) {
  var bubble = new Bubble(req.body)
  bubble.creator = req.user
  bubble.privacy = "CLOSED"

  bubble.save(function(err){
    if (err) {
      console.log("error creating bubble: " + err)

      res.render('bubbles/new', {
          title: 'Create a Bubble'
        , bubble: bubble
        , sidebar_name: 'Create'
        , errors: err.errors
      })
    }
    else {
      res.redirect('/bubbles/'+bubble._id)
    }
  })
}


// View a bubble
exports.show = function(req, res){
  // Check if the user is subscribed to this bubble
    if (req.user.subscriptions.indexOf(req.bubble._id) >= 0) {
      var user_subscribed = 1
    } else {
      var user_subscribed = 0
    }

  // Render the view
    res.render('bubbles/show', {
        sidebar_name: req.bubble.name
      , title: req.bubble.name
      , bubble: req.bubble
      , num_events: req.bubble.events.length
      , user_subscribed: user_subscribed
    })
}


// Subscribe to a bubble
exports.subscribe = function (req, res) {
  var user = req.user
    , bubble = req.bubble

  bubble.subscriptions.addToSet(user._id)

  Bubble
    .findOne({"_id" : bubble._id}, "name")
    .exec(function(err, bubbles) {
      if (err) throw new Error('Error while subscribing to a bubble')
      bubble.save(function (err) {
        if (err) throw new Error('Error while subscribing to a bubble')
        user.subscriptions.addToSet(bubble._id)
        user.save(function (err) {
          if (err) throw new Error('Error while saving user subscription')
          res.redirect(req.body.current_url)
        })
      })

    })
}


// Unsubscribe from a bubble
exports.unsubscribe = function (req, res) {
  var user = req.user
    , bubble = req.bubble

  bubble.subscriptions.remove(user._id)

  Bubble
    .findOne({"_id" : bubble._id}, "name")
    .exec(function(err, bubbles) {
      if (err) throw new Error('Error while unsubscribing from a bubble')
      bubble.save(function (err) {
        if (err) throw new Error('Error while unsubscribing from a bubble')
        user.subscriptions.remove(bubble._id)
        user.save(function (err) {
          if (err) throw new Error('Error while saving user subscription')
          res.redirect(req.body.current_url)
        })
      })

    })
}




