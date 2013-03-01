// Bubble schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var BubbleSchema = new Schema({
          creator: {type : Schema.ObjectId, ref : 'User'}
	, subscriptions: [{ id: {type : Schema.ObjectId, ref : 'User'} }]
        , pic_big: {type: String, default: '/img/default.jpg'}
        , num_subscriptions: {type: Number, default: 0}
        , type: {type: String, default: 'manual'}
        , num_events: {type: Number, default: 0}
        , num_talks: {type: Number, default: 0}
        , description: String
	, name: String
})


mongoose.model('Bubble', BubbleSchema)
