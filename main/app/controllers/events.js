// Include base scripts
  // Include the models
    var mongoose  =  require('mongoose')
      , Bubble    =  mongoose.model('Bubble')
      , Event     =  mongoose.model('Event')
      , _         =  require('underscore')

  // Include the base controllers
    var posts     =  require('./posts')


// Define main functions
  // Create an event
    exports.create = function (req, res) {
      req.bubble.num_events++
      req.post_type = 'event'
      req.Post = Event

      // Convert start_time and end_time to unix timestamp
        req.body.start_time  =  ( Date.parse(req.body.start_time) ) / 1000
        req.body.end_time    =  ( Date.parse(req.body.end_time)   ) / 1000

      posts.create(req,res)
    }
 
  // Edit an event
    exports.edit = function(req, res) {
      var bubble = req.bubble
      var event = req.event
       
      res.render('includes/post_description_edit', {
        post: event
      }, function(err, post_description) {
        res.render('includes/post_widget_edit', {
            bubble_section: 'event'
          , bubble: bubble
          , post: event
        }, function(err, post_widget) {
          res.render('bubbles/show_post', {
              sidebar_buttons: req.sidebar_buttons
            , post_description: post_description
            , sidebar_top: req.sidebar_top
            , post_widget: post_widget
            , comments: req.comments
            , bubble_section: 'event'
            , title: bubble.name
            , title: event.name
            , bubble: bubble
            , post: event
          })
        })
      })
    }
  
  // Update an event
    exports.update = function(req, res) {
      var bubble = req.bubble
      var event = req.event
       
      event = _.extend(event, req.body)
  
      event.save(function(err, doc) {
        res.redirect('/bubbles/'+bubble._id+'/events/'+event._id)
      })
    }
