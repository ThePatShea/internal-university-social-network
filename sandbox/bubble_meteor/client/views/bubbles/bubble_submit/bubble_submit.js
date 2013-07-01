Template.bubbleSubmit.events({
  'submit form': function(event) {
    event.preventDefault();

    var bubble = {
      title: $(event.target).find('[name=title]').val(),
      description: $(event.target).find('[name=description]').val(),
      category: $(event.target).find('[name=category]').val(),
      coverPhoto: $(event.target).find('[id=coverphoto_preview]').attr('src'),
      profilePicture: $(event.target).find('[id=profilepicture_preview]').attr('src')
    }
    
    Meteor.call('bubble', bubble, function(error, bubbleId) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Meteor.Router.to('bubblePage', bubbleId);
      }
    });
  },

  'dragover .dropzone': function(evt){
    console.log('Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'drop #cover_dropzone': function(evt){
    console.log('Drop');
        evt.stopPropagation();
    evt.preventDefault();

    files = evt.dataTransfer.files;

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

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 900;
            var coverphoto_height = 145;
            $("#cover_dropzone").hide();
            $("#coverphoto_upload").attr("src", e.target.result);
            $("#coverphoto_preview").attr("src", e.target.result);
            $("#coverphoto_upload").attr("title", escape(theFile.name));
            $("#coverphoto_upload").show();
            $(document).ready( function(){
              $(function(){
                function showPreview(coords){
                  var mycanvas = document.createElement('canvas');
                  mycanvas.width = coverphoto_width;
                  mycanvas.height = coverphoto_height;
                  console.log(coords);
                  mycontext = mycanvas.getContext('2d');
                  mycontext.drawImage($("#coverphoto_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, coverphoto_width, coverphoto_height);
                  var imagedata = mycanvas.toDataURL();
                  $("#coverphoto_preview").attr("src", imagedata);
                  $("#coverphoto_preview").attr("width", coverphoto_width/2);
                  $("#coverphoto_preview").attr("height", coverphoto_height/2);
                };

                $('#coverphoto_upload').Jcrop({
                  onChange: showPreview,
                  onSelect: showPreview,
                  setSelect:   [ 50, 50, coverphoto_width, coverphoto_height ],
                  aspectRatio: coverphoto_width/coverphoto_height
                }, function(){
                  jcrop_api = this;
                  jcrop_api.setOptions({ allowResize: false });
                });

              });
            });
          };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);

      }

      //If the file dropped on the dropzone is not an image then throw an error to the user
      else{
        error = new Meteor.Error(422, 'Please choose a valid image.');
        throwError(error.reason);
      }
    }
  },

  'drop #profile_dropzone': function(evt){
    console.log('Drop');
        evt.stopPropagation();
    evt.preventDefault();

    files = evt.dataTransfer.files;

    //If more than one file dropped on the dropzone then throw an error to the user
    if(files.length > 1){
      error = new Meteor.Error(422, 'Please choose only one image as the bubble image.');
      throwError(error.reason);
    }
    else{
      f = files[0];
      //If the file dropped on the dropzone is an image then start processing it
      if (f.type.match('image.*')) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            var profilepicture_width = 300;
            var profilepicture_height = 300;
            $("#profile_dropzone").hide();
            $("#profilepicture_upload").attr("src", e.target.result);
            $("#profilepicture_preview").attr("src", e.target.result);
            $("#profilepicture_upload").attr("title", escape(theFile.name));
            $("#profilepicture_upload").show();
            $(document).ready( function(){
              $(function(){
                function showPreview(coords){
                  var mycanvas = document.createElement('canvas');
                  mycanvas.width = profilepicture_width;
                  mycanvas.height = profilepicture_height;
                  console.log(coords);
                  mycontext = mycanvas.getContext('2d');
                  mycontext.drawImage($("#profilepicture_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, profilepicture_width, profilepicture_height);
                  var imagedata = mycanvas.toDataURL();
                  $("#profilepicture_preview").attr("src", imagedata);
                  $("#profilepicture_preview").attr("width", profilepicture_width);
                  $("#profilepicture_preview").attr("height", profilepicture_height);
                };

                $('#profilepicture_upload').Jcrop({
                  onChange: showPreview,
                  onSelect: showPreview,
                  setSelect:   [ 50, 50, profilepicture_width, profilepicture_height ],
                  aspectRatio: 1
                }, function(){
                  jcrop_api = this;
                  jcrop_api.setOptions({ allowResize: false });
                });

              });
            });
          };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);

      }

      //If the file dropped on the dropzone is not an image then throw an error to the user
      else{
        error = new Meteor.Error(422, 'Please choose a valid image.');
        throwError(error.reason);
      }
    }
  },

});

