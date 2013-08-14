Template.exploreEventSubmit.events({
  'click .cb-explore-eventSubmit-form > .cb-submit-container > .cb-submit': function(event) {
    event.preventDefault();
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Create Event', $(event.target).find('[name=name]').val()]);

    var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();
    console.log('Event photo: ', $("#eventPhoto").attr("src"));

    var eventAttributes = { 
      dateTime: new Date().getTime(),
      location: $('.cb-explore-eventSubmit-form > .first > .event-location').val(),
      name: $('.cb-explore-eventSubmit-form > .first > .event-name').val(),
      body: $('.cb-explore-eventSubmit-form > .event-details').val(),
      postType: 'event',
      exploreId: Session.get('currentExploreId'),
      attendees: [Meteor.userId()],
      eventPhoto: $("#eventPhoto").attr("src"),
      retinaEventPhoto: $("#eventRetinaPhoto").attr("src")
    };


    console.log("event attributes: ", eventAttributes );
    createPost(eventAttributes);
  },

  'dragover .cb-explore-eventSubmit-form .attach-files > .drop-zone': function(evt){
    console.log('Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'change .cb-explore-eventSubmit-form .attach-files > .drop-zone > .file-chooser-invisible': function(evt){
      files = evt.target.files;
      console.log('Event picture: ', files);
      //If more than one file dropped on the dropzone then throw an error to the user.
      if(files.length > 1){
        error = new Meteor.Error(422, 'Please choose only one image as the bubble image.');
        throwError(error.reason);
      }
      else{
        f = files[0];
        //If the file dropped on the dropzone is an image then start processing it
        if (f.type.match('image.*')) {
          var reader = new FileReader();
          var mainCanvas = document.getElementById('event-main-canvas');
          var retinaCanvas = document.getElementById('event-retina-canvas');
          var mainContext = mainCanvas.getContext('2d');
          var retinaContext = retinaCanvas.getContext('2d');
          var profileImage = new Image();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
            return function(e) {
                $("#event_drop_zone").hide();
                $(".crop").attr("src", e.target.result);
                profileImage.src = e.target.result;
                cropArea = $('.crop').imgAreaSelect({instance: true, aspectRatio: '34:23', imageHeight: profileImage.height, imageWidth: profileImage.width, minWidth: '170', minHeight: '115', x1: '10', y1: '10', x2: '180', y2: '125', parent: "#add-picture", handles: true, onSelectChange: function(img, selection) {
                  mainContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 340, 230);
                  retinaContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 680, 460);
                  $("#eventPhoto").attr("src",mainCanvas.toDataURL());
                  $("#eventRetinaPhoto").attr("src",retinaCanvas.toDataURL());
                }});
            };
          })(f);
          reader.readAsDataURL(f);
        }
        else{
          error = new Meteor.Error(422, 'Please choose a valid image.');
          throwError(error.reason);
        }
      }
  }

});

Template.exploreEventSubmit.rendered = function() {
  $(".date-picker").glDatePicker(
    {
      cssName: 'flatwhite',
      allowMonthSelect: false,
      allowYearSelect: false
    }
  );

  //Format the time when the textbox is changed
  $("[name=time]").change(function(){
    var time = $("[name=time]").val();
    if (time) {
      var firstAlphabet  = parseInt(time[0]);

      if (time.length > 9 || (!firstAlphabet)){
        $("[name=time]").val("");
      }else{
        formatedTime = moment(time,"h:mm a").format("h:mm a");
        $("[name=time]").val(formatedTime);
      }

    }
  });

}