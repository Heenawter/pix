
$(function() {
  var socket = io();

  var current_user = "User1";
  var album_owner = "User1";
  var current_album;

  socket.on('connect', function (data) {
    $("#album-owner").text(album_owner);
    socket.emit("get_albums", album_owner);
    // socket.emit("add_album", {client: current_user, user: album_owner, album_name: "Also an Album"});
    // socket.emit("add_image", {client: current_user, user: album_owner, album_name: "Also an Album", img_name: "An Image", img_src:"images/test-picture.png"});
  });


/*
  socket.on("message", function(message) {
    alert(message);
  });*/



  /***************************************************************/
  /* FILL SIDEBAR WITH ALBUMS
  /***************************************************************/

  socket.on("get_albums", function(response) {
    let album_list = $("#album-list");

    let start_album = "<div class='panel-heading' role='tab'><h4 class='panel-title'>";
    let collapse    = "<a data-toggle='collapse' data-parent='#accordion' href='#collapse0' aria-expanded='true'>";
    let album_html  = "<img src='images/folder-small.png'><span class='album-title'>";
    let end_album   = "<span class='del_alb'><span class='delete-album-icon fa fa-trash fa-lg'></span></span></span></a></h4></div>";

    let blank_img_list = "<div id='collapse0' class='panel-collapse collapse in' role='tabpanel'></div>";

    //handle first album, then do the rest
    let album_title = response.shift().album_name;
    album_list.append(start_album + collapse + album_html + album_title + end_album + blank_img_list);
    socket.emit("get_album_image_names", {user: album_owner, album_name: album_title, id: 0});
    for(album in response) {
      let index = parseInt(album) + 1;
          album_title = response[album].album_name;
      collapse = "<a data-toggle='collapse' data-parent='#accordion' href='#collapse" + index + "' aria-expanded='false'>";
      blank_img_list = "<div id='collapse" + index + "' class='panel-collapse collapse' role='tabpanel'></div>";
      album_list.append(start_album + collapse + album_html + album_title + end_album + blank_img_list);
      socket.emit("get_album_image_names", {user: album_owner, album_name: album_title, id: index});
    }

    let add_album =  "<div class='panel-heading' id='add-new-album'><h4 class='panel-title'><a href='#' data-toggle='modal' data-target='#albumformbox'>"
        add_album += "<img src='images/folder-small.png'><span id='add-new-album-btn'>Add new album...</a></h4></div>"
    album_list.append(add_album);

    initAlbumChange();
    let first_album = $(".album-title").first().text();
    changeAlbum(album_owner, first_album);
  });

  // bind changing images in main area to expanding an album
  // that is, when a user clicks on an album on the left, it updates the right
  function initAlbumChange() {
    $('#accordion').on('show.bs.collapse', function (e) {
      var name = $(e.target).prev('.panel-heading').text();
      if(name != "Add new album...")
        changeAlbum(album_owner, name);
    });
  }

  // this is called a lot, so made it a function
  // just changes the name at the top and changes the images being displayed
  function changeAlbum(owner, name) {
    $("#album-name").text(name);
    current_album = name;
    socket.emit("get_album_images", {user: owner, album_name: name});
  }



  /***************************************************************/
  /* FILL SIDEBAR WITH IMAGE NAMES
  /***************************************************************/

  socket.on("get_album_image_names", function(response) {
    let collapse = $("#collapse" + response.index);

    let img_table      = "<div class='panel-body'><table class='table'><tbody></tbody></table></div>"
    let start_img      = "<tr><td><img src='images/heart.png'><span class='picture-name'>";
    let end_img        = "</span><span class='delete-photo-icon-small fa fa-trash fa-lg'></span></td></tr>";

    collapse.append(img_table);
    let image_list = collapse.find('tbody');
    for(image in response.names) {
      let image_name = response.names[image].img_name;
      image_list.append(start_img + image_name + end_img);
    }

    let add_new =  "<tr id='add-new-img-btn'><td><span class='fa fa-plus'></span>";
        add_new += "<span class='picture-name'>Add new image...</span></td></tr>";
    image_list.append(add_new);
  });

  function fillImgList() {
    let index = 0;
    let num_albums = $(".panel-heading").length - 1;
    let album_title = $("#collapse" + index).prev('.panel-heading').text();

    socket.emit("get_album_image_names", {user: album_owner, album_name: album_title, id: index});
    for(index; index < num_albums; index++) {

    }
  }



  /***************************************************************/
  /* FILL MAIN AREA WITH IMAGES
  /***************************************************************/

  socket.on("get_album_images", function(response) {
    let image_list = $("#album-images");
    image_list.empty();

    let img_start = "<div class='album-item col-lg-3 col-md-4 col-sm-6 col-xs-12'><div class='thumbnail album-pic'>";
    let img_contents = "<img class='album-img' src='";
    let img_end = "'><span class='album-overlay'><span class='delete-photo-icon fa fa-trash fa-lg'></span></span></div>";

    for(image in response) {
      let img_name = response[image].img_name;
      let img_src = response[image].img_src;
      image_list.append(img_start + img_contents + img_src + "' alt='" + img_name + img_end);
    }

    let add_img =  "<div class='after col-lg-3 col-md-4 col-sm-6 col-xs-12'><button type='button' class='add-btn'>";
        add_img += "<span class='fa fa-plus-circle fa-lg'></span></a></div>";

    image_list.append(add_img);
    if ($('#lightbox').length != 0)
      lightboxInit();
  });

  // this is for the overlay display of images
  function lightboxInit() {
    $('.thumbnail').click(function(e){
      let size = window.getComputedStyle(document.body,':after').getPropertyValue('content').replace( /"/g, '' ); //http://adactio.com/journal/5429/

      /* http://codepen.io/bradfrost/pen/tfCAp */
      if(size == "widescreen") {
        e.preventDefault();
        var $img = $(this).find('img'),
            src = $img.attr('src');
            name = $img.attr('alt');
        buildLightBox(src, name);
      }
    });
  }

  socket.on("get_image", function(response) {

  });



  /***************************************************************/
  /* ADD/DELETE ALBUM FUNCTIONS
  /***************************************************************/
    $('#albumformbox #album_form').submit(function(){
        album = {
            client: current_user,
            user: album_owner,
            album_name: $('#alb_name').val().toString()
        };

        socket.emit('add_album', album);
        $('#alb_name').val('');
        $("#album-list").innerHTML('');
        socket.emit('get_albums', album_owner);
        return false;
    });

    $('#album-list').on('click', '.del_alb', function(event){
      console.log("HELLO ");
    });



  /***************************************************************/
  /* SERVER MESSAGES
  /***************************************************************/

    socket.on('message', function(msg){
        $('#albumformbox #error_text').text(msg);
        console.log(msg);
    });

});
