
$(function() {
  var socket = io.connect('http://127.0.0.1:3000');

  socket.on('connect', function (data) {
    socket.emit("get_albums", "test");
  });

  socket.on("get_albums", function(response) {
    alert(response);
  });

  socket.on("get_album_images", function(response) {

  }

  socket.on("get_image", function(response) {

  }

});
