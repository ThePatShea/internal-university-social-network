Template.bubbleSubmit.helpers({
  'isLevel2User': function() {
    return '2' == Meteor.user().userType;
  }
});

Template.bubbleSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    //Google Analytics
    // _gaq.push(['_trackEvent', 'Bubble', 'Create Bubble', $(event.target).find('[name=title]').val()]);

    var bubble = {
      title: $(event.target).find('[name=title]').val(),
      description: $(event.target).find('[name=description]').val(),
      category: $(event.target).find('[name=category]').val(),
      coverPhoto: $(event.target).find('[id=coverphoto_preview]').attr('src'),
      retinaCoverPhoto: $(event.target).find('[id=coverphoto_retina]').attr('src'),
      profilePicture: $(event.target).find('[id=profilepicture_preview]').attr('src'),
      retinaProfilePicture: $(event.target).find('[id=profilepicture_retina]').attr('src'),
      bubbleType: $(event.target).find('[name=bubbleType]').val()
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
        /*reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 1280;
            var coverphoto_height = 150;
            var retina_width = 2560;
            var retina_height = 300;
            $("#cover_dropzone").hide();
            $("#coverfilesToUpload").hide();
            $("#coverphoto_upload").attr("src", e.target.result);
            $("#coverphoto_preview").attr("src", e.target.result);
            $("#coverphoto_upload").attr("title", escape(theFile.name));
            $("#coverphoto_upload").show();
            $(document).ready( function(){
              $(function(){
                function showPreview(coords){
                  var mycanvas = document.createElement('canvas');
                  var retinacanvas = document.createElement('canvas');
                  mycanvas.width = coverphoto_width;
                  mycanvas.height = coverphoto_height;
                  retinacanvas.width = retina_width;
                  retinacanvas.height = retina_height;
                  console.log(coords);
                  var mycontext = mycanvas.getContext('2d');
                  var retinacontext = retinacanvas.getContext('2d');
                  mycontext.drawImage($("#coverphoto_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, coverphoto_width, coverphoto_height);
                  retinacontext.drawImage($("#coverphoto_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, retina_width, retina_height);
                  var imagedata = mycanvas.toDataURL();
                  var retinaImageData = retinacanvas.toDataURL();
                  $("#coverphoto_preview").attr("src", imagedata);
                  $("#coverphoto_preview").attr("width", coverphoto_width/2);
                  $("#coverphoto_preview").attr("height", coverphoto_height/2);
                  $("#coverphoto_retina").attr("src", retinaImageData);
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
        })(f);*/

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 1280;
            var coverphoto_height = 150;
            var retina_width = 2560;
            var retina_height = 300;
            $("#cover_dropzone").hide();
            $("#coverfilesToUpload").hide();
            $("#coverphoto_upload").attr("src", e.target.result);
            $("#coverphoto_preview").attr("src", e.target.result);
            $("#coverphoto_upload").attr("title", escape(theFile.name));
            $("#coverphoto_upload").show();
            $(document).ready(function(){
              // Apply jrac on some image.
              var tempcanvas = document.createElement('canvas');
              var tempcontext = tempcanvas.getContext('2d');
              var mycanvas = document.createElement('canvas');
              var retinacanvas = document.createElement('canvas');
              var mycontext = mycanvas.getContext('2d');
              var retinacontext = retinacanvas.getContext('2d');
              mycanvas.width = coverphoto_width;
              mycanvas.height = coverphoto_height;
              retinacanvas.width = retina_width;
              retinacanvas.height = retina_height;
              var cropx, cropy, cropwidth, cropheight, imagewidth, imageheight;
              cropwidth = 1280;
              cropheight = 150;
              var img = $("#coverphoto_upload")[0]; // Get my img elem
              var pic_real_width, pic_real_height;
              $("<img/>") // Make in memory copy of image to avoid css issues
                  .attr("src", $(img).attr("src"))
                  .load(function() {
                      imagewidth = this.width;   // Note: $(this).width() will not
                      imageheight = this.height; // work for in memory images.
                      $('#coverphoto_upload').jrac({'crop_width': cropwidth, 'crop_height': cropheight, 'image_width': imagewidth, 'image_height': imageheight, 'viewport_width': imagewidth, 'viewport_height': imageheight, 'viewport_onload': function(){
                                        console.log('Viewport loaded.');
                                        $(".jrac_zoom_slider").hide();
                                        $(".ui-resizable-handle").hide();
                                           var $viewport = this;
                                           $viewport.observator.register('jrac_crop_x', $(document), function(element, event_name, value){
                                              cropx = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#coverphoto_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              retinacontext.drawImage($("#coverphoto_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, retina_width, retina_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#coverphoto_preview").attr("src", imagedata);
                                              $("#coverphoto_preview").attr("width", coverphoto_width/2);
                                              $("#coverphoto_preview").attr("height", coverphoto_height/2);
                                              $("#coverphoto_retina").attr("src", retinaImageData);
                                            });
                                           $viewport.observator.register('jrac_crop_y', $(document), function(element, event_name, value){
                                              cropy = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#coverphoto_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#coverphoto_preview").attr("src", imagedata);
                                              $("#coverphoto_preview").attr("width", coverphoto_width/2);
                                              $("#coverphoto_preview").attr("height", coverphoto_height/2);
                                              $("#coverphoto_retina").attr("src", retinaImageData);
                                            });
                                      }
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


  'change #coverfilesToUpload': function(evt){


    var files = evt.target.files;


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
        /*reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 1280;
            var coverphoto_height = 150;
            var retina_width = 2560;
            var retina_height = 300;
            $("#cover_dropzone").hide();
            $("#coverfilesToUpload").hide();
            $("#coverphoto_upload").attr("src", e.target.result);
            $("#coverphoto_preview").attr("src", e.target.result);
            $("#coverphoto_upload").attr("title", escape(theFile.name));
            $("#coverphoto_upload").show();
            $(document).ready( function(){
              $(function(){
                function showPreview(coords){
                  var mycanvas = document.createElement('canvas');
                  var retinacanvas = document.createElement('canvas');
                  mycanvas.width = coverphoto_width;
                  mycanvas.height = coverphoto_height;
                  retinacanvas.width = retina_width;
                  retinacanvas.height = retina_height;
                  console.log(coords);
                  var mycontext = mycanvas.getContext('2d');
                  var retinacontext = retinacanvas.getContext('2d');
                  mycontext.drawImage($("#coverphoto_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, coverphoto_width, coverphoto_height);
                  retinacontext.drawImage($("#coverphoto_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, retina_width, retina_height);
                  var imagedata = mycanvas.toDataURL();
                  var retinaImageData = retinacanvas.toDataURL();
                  $("#coverphoto_preview").attr("src", imagedata);
                  $("#coverphoto_preview").attr("width", coverphoto_width/2);
                  $("#coverphoto_preview").attr("height", coverphoto_height/2);
                  $("#coverphoto_retina").attr("src", retinaImageData);
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
        })(f);*/

        // Read in the image file as a data URL.

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 1280;
            var coverphoto_height = 150;
            var retina_width = 2560;
            var retina_height = 300;
            $("#cover_dropzone").hide();
            $("#coverfilesToUpload").hide();
            $("#coverphoto_upload").attr("src", e.target.result);
            $("#coverphoto_preview").attr("src", e.target.result);
            $("#coverphoto_upload").attr("title", escape(theFile.name));
            $("#coverphoto_upload").show();
            $(document).ready(function(){
              // Apply jrac on some image.
              var tempcanvas = document.createElement('canvas');
              var tempcontext = tempcanvas.getContext('2d');
              var mycanvas = document.createElement('canvas');
              var retinacanvas = document.createElement('canvas');
              var mycontext = mycanvas.getContext('2d');
              var retinacontext = retinacanvas.getContext('2d');
              mycanvas.width = coverphoto_width;
              mycanvas.height = coverphoto_height;
              retinacanvas.width = retina_width;
              retinacanvas.height = retina_height;
              var cropx, cropy, cropwidth, cropheight, imagewidth, imageheight;
              cropwidth = 1280;
              cropheight = 150;
              var img = $("#coverphoto_upload")[0]; // Get my img elem
              var pic_real_width, pic_real_height;
              $("<img/>") // Make in memory copy of image to avoid css issues
                  .attr("src", $(img).attr("src"))
                  .load(function() {
                      imagewidth = this.width;   // Note: $(this).width() will not
                      imageheight = this.height; // work for in memory images.
                      $('#coverphoto_upload').jrac({'crop_width': cropwidth, 'crop_height': cropheight, 'image_width': imagewidth, 'image_height': imageheight, 'viewport_width': imagewidth, 'viewport_height': imageheight, 'viewport_onload': function(){
                                        console.log('Viewport loaded.');
                                        $(".jrac_zoom_slider").hide();
                                        $(".ui-resizable-handle").hide();
                                           var $viewport = this;
                                           $viewport.observator.register('jrac_crop_x', $(document), function(element, event_name, value){
                                              cropx = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#coverphoto_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              retinacontext.drawImage($("#coverphoto_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, retina_width, retina_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#coverphoto_preview").attr("src", imagedata);
                                              $("#coverphoto_preview").attr("width", coverphoto_width/2);
                                              $("#coverphoto_preview").attr("height", coverphoto_height/2);
                                              $("#coverphoto_retina").attr("src", retinaImageData);
                                            });
                                           $viewport.observator.register('jrac_crop_y', $(document), function(element, event_name, value){
                                              cropy = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#coverphoto_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#coverphoto_preview").attr("src", imagedata);
                                              $("#coverphoto_preview").attr("width", coverphoto_width/2);
                                              $("#coverphoto_preview").attr("height", coverphoto_height/2);
                                              $("#coverphoto_retina").attr("src", retinaImageData);
                                            });
                                      }
                      });
                  });
              



            });

          };
        })(f);

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
        /*reader.onload = (function(theFile) {
          return function(e) {
            var profilepicture_width = 300;
            var profilepicture_height = 300;
            var retina_width = 600;
            var retina_height = 600;
            $("#profile_dropzone").hide();
            $("#profilefilesToUpload").hide();
            $("#profilepicture_upload").attr("src", e.target.result);
            $("#profilepicture_preview").attr("src", e.target.result);
            $("#profilepicture_upload").attr("title", escape(theFile.name));
            $("#profilepicture_upload").show();
            $(document).ready( function(){
              $(function(){
                function showPreview(coords){
                  var mycanvas = document.createElement('canvas');
                  var retinacanvas = document.createElement('canvas');
                  mycanvas.width = profilepicture_width;
                  mycanvas.height = profilepicture_height;
                  retinacanvas.width = retina_width;
                  retinacanvas.height = retina_height;
                  console.log(coords);
                  var mycontext = mycanvas.getContext('2d');
                  var retinacontext = retinacanvas.getContext('2d');
                  mycontext.drawImage($("#profilepicture_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, profilepicture_width, profilepicture_height);
                  retinacontext.drawImage($("#profilepicture_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, retina_width, retina_height);
                  var imagedata = mycanvas.toDataURL();
                  var retinaImageData = retinacanvas.toDataURL();
                  $("#profilepicture_preview").attr("src", imagedata);
                  $("#profilepicture_preview").attr("width", profilepicture_width);
                  $("#profilepicture_preview").attr("height", profilepicture_height);
                  $("#profilepicture_retina").attr("src", retinaImageData);
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
        })(f);*/

        // Read in the image file as a data URL.

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 300;
            var coverphoto_height = 300;
            var retina_width = 600;
            var retina_height = 600;
            $("#profilepicture_dropzone").hide();
            $("#profilepicture_upload").attr("src", e.target.result);
            $("#profilepicture_preview").attr("src", e.target.result);
            $("#profilepicture_upload").attr("title", escape(theFile.name));
            $("#profilepicture_upload").show();
            $(document).ready(function(){
              // Apply jrac on some image.
              var tempcanvas = document.createElement('canvas');
              var tempcontext = tempcanvas.getContext('2d');
              var mycanvas = document.createElement('canvas');
              var retinacanvas = document.createElement('canvas');
              var mycontext = mycanvas.getContext('2d');
              var retinacontext = retinacanvas.getContext('2d');
              mycanvas.width = coverphoto_width;
              mycanvas.height = coverphoto_height;
              retinacanvas.width = retina_width;
              retinacanvas.height = retina_height;
              var cropx, cropy, cropwidth, cropheight, imagewidth, imageheight;
              cropwidth = 150;
              cropheight = 150;
              var img = $("#profilepicture_upload")[0]; // Get my img elem
              var pic_real_width, pic_real_height;
              $("<img/>") // Make in memory copy of image to avoid css issues
                  .attr("src", $(img).attr("src"))
                  .load(function() {
                      imagewidth = this.width;   // Note: $(this).width() will not
                      imageheight = this.height; // work for in memory images.
                      $('#profilepicture_upload').jrac({'crop_width': cropwidth, 'crop_height': cropheight, 'image_width': imagewidth, 'image_height': imageheight, 'viewport_width': imagewidth, 'viewport_height': imageheight, 'viewport_onload': function(){
                                        console.log('Viewport loaded.');
                                        $(".jrac_zoom_slider").hide();
                                        $(".ui-resizable-handle").hide();
                                           var $viewport = this;
                                           $viewport.observator.register('jrac_crop_x', $(document), function(element, event_name, value){
                                              cropx = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              retinacontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, retina_width, retina_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#profilepicture_preview").attr("src", imagedata);
                                              $("#profilepicture_preview").attr("width", coverphoto_width/2);
                                              $("#profilepicture_preview").attr("height", coverphoto_height/2);
                                              $("#profilepicture_retina").attr("src", retinaImageData);
                                            });
                                           $viewport.observator.register('jrac_crop_y', $(document), function(element, event_name, value){
                                              cropy = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#profilepicture_preview").attr("src", imagedata);
                                              $("#profilepicture_preview").attr("width", coverphoto_width/2);
                                              $("#profilepicture_preview").attr("height", coverphoto_height/2);
                                              $("#profilepicture_retina").attr("src", retinaImageData);
                                            });
                                      }
                      });
                  });
              



            });

          };
        })(f);

        reader.readAsDataURL(f);

      }

      //If the file dropped on the dropzone is not an image then throw an error to the user
      else{
        error = new Meteor.Error(422, 'Please choose a valid image.');
        throwError(error.reason);
      }
    }
  },

  'change #profilefilesToUpload': function(evt){

    var files = evt.target.files;

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
        /*reader.onload = (function(theFile) {
          return function(e) {
            var profilepicture_width = 300;
            var profilepicture_height = 300;
            var retina_width = 600;
            var retina_height = 600;
            var cropx, cropy, cropwidth, cropheight, imagewidth, imageheight;
            cropwidth = 150;
            cropheight = 150;
            $("#profile_dropzone").hide();
            $("#profilefilesToUpload").hide();
            $("#profilepicture_upload").attr("src", e.target.result);
            $("#profilepicture_preview").attr("src", e.target.result);
            $("#profilepicture_upload").attr("title", escape(theFile.name));
            $("#profilepicture_upload").show();
            $(document).ready( function(){
              $(function(){
                function showPreview(){
                  var mycanvas = document.createElement('canvas');
                  var retinacanvas = document.createElement('canvas');
                  mycanvas.width = profilepicture_width;
                  mycanvas.height = profilepicture_height;
                  retinacanvas.width = retina_width;
                  retinacanvas.height = retina_height;
                  //console.log(coords);
                  console.log(cropx, cropy);
                  var mycontext = mycanvas.getContext('2d');
                  var retinacontext = retinacanvas.getContext('2d');
                  mycontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, profilepicture_width, profilepicture_height);
                  retinacontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, retina_width, retina_height);
                  var imagedata = mycanvas.toDataURL();
                  var retinaImageData = retinacanvas.toDataURL();
                  $("#profilepicture_preview").attr("src", imagedata);
                  $("#profilepicture_preview").attr("width", profilepicture_width);
                  $("#profilepicture_preview").attr("height", profilepicture_height);
                  $("#profilepicture_retina").attr("src", retinaImageData);
                };

                $("<img/>") // Make in memory copy of image to avoid css issues
                  .attr("src", $(img).attr("src"))
                  .load(function() {
                      imagewidth = this.width;   // Note: $(this).width() will not
                      imageheight = this.height; // work for in memory images.
                      $('#profileprofilepicture_upload').jrac({'crop_width': cropwidth, 'crop_height': cropheight, 'image_width': imagewidth, 'image_height': imageheight, 'viewport_width': imagewidth, 'viewport_height': imageheight, 'viewport_onload': function(){
                                        console.log('Viewport loaded.');
                                        $(".jrac_zoom_slider").hide();
                                        $(".ui-resizable-handle").hide();
                                           var $viewport = this;
                                           $viewport.observator.register('jrac_crop_x', $(document), function(element, event_name, value){
                                              cropx = value;
                                              showPreview();
                                            });
                                           $viewport.observator.register('jrac_crop_y', $(document), function(element, event_name, value){
                                              cropy = value;
                                              showPreview();
                                            });
                                      }
                      });
                  });
              });
              
            });
          }
        })(f);*/

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 300;
            var coverphoto_height = 300;
            var retina_width = 600;
            var retina_height = 600;
            $("#profilepicture_dropzone").hide();
            $("#profilepicture_upload").attr("src", e.target.result);
            $("#profilepicture_preview").attr("src", e.target.result);
            $("#profilepicture_upload").attr("title", escape(theFile.name));
            $("#profilepicture_upload").show();
            $(document).ready(function(){
              // Apply jrac on some image.
              var tempcanvas = document.createElement('canvas');
              var tempcontext = tempcanvas.getContext('2d');
              var mycanvas = document.createElement('canvas');
              var retinacanvas = document.createElement('canvas');
              var mycontext = mycanvas.getContext('2d');
              var retinacontext = retinacanvas.getContext('2d');
              mycanvas.width = coverphoto_width;
              mycanvas.height = coverphoto_height;
              retinacanvas.width = retina_width;
              retinacanvas.height = retina_height;
              var cropx, cropy, cropwidth, cropheight, imagewidth, imageheight;
              cropwidth = 150;
              cropheight = 150;
              var img = $("#profilepicture_upload")[0]; // Get my img elem
              var pic_real_width, pic_real_height;
              $("<img/>") // Make in memory copy of image to avoid css issues
                  .attr("src", $(img).attr("src"))
                  .load(function() {
                      imagewidth = this.width;   // Note: $(this).width() will not
                      imageheight = this.height; // work for in memory images.
                      $('#profilepicture_upload').jrac({'crop_width': cropwidth, 'crop_height': cropheight, 'image_width': imagewidth, 'image_height': imageheight, 'viewport_width': imagewidth, 'viewport_height': imageheight, 'viewport_onload': function(){
                                        console.log('Viewport loaded.');
                                        $(".jrac_zoom_slider").hide();
                                        $(".ui-resizable-handle").hide();
                                           var $viewport = this;
                                           $viewport.observator.register('jrac_crop_x', $(document), function(element, event_name, value){
                                              cropx = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              retinacontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, retina_width, retina_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#profilepicture_preview").attr("src", imagedata);
                                              $("#profilepicture_preview").attr("width", coverphoto_width/2);
                                              $("#profilepicture_preview").attr("height", coverphoto_height/2);
                                              $("#profilepicture_retina").attr("src", retinaImageData);
                                            });
                                           $viewport.observator.register('jrac_crop_y', $(document), function(element, event_name, value){
                                              cropy = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#profilepicture_preview").attr("src", imagedata);
                                              $("#profilepicture_preview").attr("width", coverphoto_width/2);
                                              $("#profilepicture_preview").attr("height", coverphoto_height/2);
                                              $("#profilepicture_retina").attr("src", retinaImageData);
                                            });
                                      }
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

  }

});


Template.bubbleSubmit.rendered = function(){
  $("#profilepicture_retina").hide();
  $("#coverphoto_retina").hide();
  $("#profilepicture_preview").hide();
  $("#coverphoto_preview").hide();
}

