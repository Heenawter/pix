
$(function() {
  var socket = io.connect('http://127.0.0.1:3000');

  let current_user = "User1";
  let album_owner = "User1";
  let current_album = "Default Album";

  socket.on('connect', function (data) {
    $("#album-owner").append(album_owner);
    $("#album-name").append(current_album);
    socket.emit("get_albums", current_user);

  });

  socket.on("get_albums", function(response) {
    let album_list = $("#album-list");

    let start_album = "<div class='panel-heading' role='tab'><h4 class='panel-title'>";
    let collapse    = "<a data-toggle='collapse' data-parent='#accordion' href='#collapse0' aria-expanded='true'>";
    let album_html  = "<img src='images/folder-small.png'><span class='album-title'> ";
    let end_album   = "</span><span class='delete-album-icon fa fa-trash fa-lg'></span></a></h4></div>";

    let blank_img_list = "<div id='collapse0' class='panel-collapse collapse in' role='tabpanel'></div>";

    //handle first album, then do the rest
    let album_title = response.shift().album_name;
    album_list.append(start_album + collapse + album_html + album_title + end_album + blank_img_list);

    for(album in response) {
      let index = parseInt(album) + 1;
          album_title = response[album].album_name;
      collapse = "<a data-toggle='collapse' data-parent='#accordion' href='#collapse" + index + "' aria-expanded='false'>";
      blank_img_list = "<div id='collapse" + index + "' class='panel-collapse collapse in' role='tabpanel'></div>";
      album_list.append(start_album + collapse + album_html + album_title + end_album + blank_img_list);
    }
  });

  socket.on("get_album_image_names", function(response) {
    let image_list = $("#collapse" + 1);

    let img_table      = "<div class='panel-body'><table class='table'>"
    let start_img      = "<tr><td><img src='images/heart.png'><span class='picture-name'>";
    let end_img        = "</span><span class='delete-photo-icon-small fa fa-trash fa-lg'></span></td></tr>";
    let end_img_list   = "</table></div>"

    image_list.append(img_table + start_img + "hello" + end_img + end_img_list);

    // let index = 0;
    // for(image in response) {
    //   let image_name = response[image].img_name;
    //   album_list.append(start_img_list + img_table + start_img + image_name + end_img + end_img_list);
    //   index++;
    //   start_img_list = "<div id='collapse" + index + "' class='panel-collapse collapse in' role='tabpanel'>";
    // }
  });

  socket.on("get_album_images", function(response) {

  });

  socket.on("get_image", function(response) {

  });

});
