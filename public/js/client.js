$(function() {
  var socket = io();

  var current_user = "";
  var album_owner = "";
  var current_album;


/***************************************************************/
/* USERS
/***************************************************************/

  socket.on('connect', function (data) {
    socket.emit("get_logged_in");
  });

  socket.on("set_logged_in", function (loggedInUser, allUsers) {
    current_user = loggedInUser;
    if(album_owner === "")
      album_owner = loggedInUser;
    $("#album-owner").text(album_owner);
    socket.emit("get_albums", album_owner);
    toggle_search();
    let counter = 0;
    while(counter < allUsers.length) {
      addTab(allUsers[counter], counter);
      counter++;
    }
  });

  socket.on('reload_tabs', function(user, allUsers) {
    let tabs = $('#online-users').find(".ui-tabs-nav");
    tabs.html("");
    let counter = 0;
    while(counter < allUsers.length) {
      addTab(allUsers[counter], counter);
      counter++;
    }
  });

  $('#online-users').tabs({
    activate: function(event, ui) {
      album_owner = $('#tabs-' + ui.newTab.index()).text();
      $("#album-owner").text(album_owner);
      socket.emit("get_albums", album_owner);
    }
  });

  $(".logout-btn").on('click', function(e) {
    socket.emit("get_logged_out", current_user);
  });

  // source: https://jqueryui.com/tabs/#manipulation
  function addTab(user, index) {
    let tabTemplate = "<li id='tab-label-" + index + "'><a href='#{href}'>#{label}</a></li>";
    let tabs = $('#online-users');
    var label = user;
      id = "tabs-" + index;
      li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),

    tabs.find( ".ui-tabs-nav" ).append(li);
    tabs.append( "<div class='tab_content' id='" + id + "'><p>" + label + "</p></div>");
    tabs.tabs( "refresh" );

    if(user === current_user && user === album_owner) {
      tabs.tabs({ active: index });
    }
  }


  /***************************************************************/
  /* FILL SIDEBAR WITH ALBUMS
  /***************************************************************/

  socket.on("get_albums", function(response) {
    let album_list = $("#album-list");
    album_list.html("");

    let start_album = "<div class='panel-heading' role='tab'><h4 class='panel-title'>";
    let collapse    = "<a data-toggle='collapse' data-parent='#accordion' href='#collapse0' aria-expanded='true'>";
    let album_html  = "<img src='images/folder-small.png'><span class='album-title'>";
    let end_album   = "</span></a></h4></div>";
    let blank_img_list = "<div id='collapse0' class='panel-collapse collapse in' role='tabpanel'></div>";
    if(current_user === album_owner) {
      end_album = "<span class='del_alb'><span class='delete-album-icon fa fa-trash fa-lg'></span></span></span></a></h4></div>";
    }

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

    if(current_user === album_owner) {
      let add_album =  "<div class='panel-heading' id='add-new-album'><h4 class='panel-title'><a href='#' data-toggle='modal' data-target='#albumformbox'>"
          add_album += "<img src='images/folder-small.png'><span id='add-new-album-btn'>Add new album...</a></h4></div>"
      album_list.append(add_album);
    }

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
    let album = {user: owner,
      album_name: name}
    socket.emit("get_album_images", album);
  }



  /***************************************************************/
  /* FILL SIDEBAR WITH IMAGE NAMES
  /***************************************************************/

  socket.on("get_album_image_names", function(response) {
    let collapse = $("#collapse" + response.index);

    let img_table      = "<div class='panel-body'><table class='table'><tbody></tbody></table></div>"
    let start_img      = "<tr><td><img src='images/heart.png'><span class='picture-name'>";
    let end_img        = "</span></td></tr>";

    if(current_user === album_owner) {
      end_img = "<span class='del_img_side'><span class='delete-photo-icon-small fa fa-trash fa-lg'></span></span></span></a></h4></div>";
    }


    collapse.append(img_table);
    let image_list = collapse.find('tbody');
    for(image in response.names) {
      let image_name = response.names[image].img_name;
      image_list.append(start_img + image_name + end_img);
    }

    if(current_user === album_owner) {
      let add_new =  "<tr id='add-new-img-btn'><td><span class='fa fa-plus'></span>";
          add_new += "<span class='picture-name' data-toggle='modal' data-target='#editorbox'>Add new image...</span></td></tr>";
      image_list.append(add_new);
    }
  });

  function fillImgList() {
    let index = 0;
    let num_albums = $(".panel-heading").length - 1;
    let album_title = $("#collapse" + index).prev('.panel-heading').text();

    let album = {user: album_owner,
        album_name: album_title,
        id: index}
    socket.emit("get_album_image_names", album);
  }



  /***************************************************************/
  /* FILL MAIN AREA WITH IMAGES
  /***************************************************************/

  socket.on("get_album_images", function(response) {
    let image_list = $("#album-images");
    image_list.empty();

    let img_start = "<div class='album-item col-lg-3 col-md-4 col-sm-6 col-xs-12'><div class='thumbnail album-pic'>";
    let img_contents = "<span class='album-overlay'></span><img class='album-img' src='";
    let img_end = "'></div>";
    if(current_user === album_owner) {
      img_contents = "<span class='album-overlay'><span class='del_img'><span class='delete-photo-icon fa fa-trash fa-lg'></span></span></span><img class='album-img' src='";
    }


    for(image in response) {
      let img_name = response[image].img_name;
      let img_src = response[image].img_src;
      image_list.append(img_start + img_contents + img_src + "' alt='" + img_name + img_end);
    }

    if(current_user === album_owner) {
      let add_img =  "<div class='after col-lg-3 col-md-4 col-sm-6 col-xs-12'><button type='button' class='add-btn' data-toggle='modal' data-target='#editorbox'>";
          add_img += "<span class='fa fa-plus-circle fa-lg'></span></a></div>";
      image_list.append(add_img);
    }

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

  // GET CURRENT IMAGE
    // Used for deleting image from sidebar
  socket.on("get_image", function(response) {
      buildLightBox(response[0].img_src, response[0].img_name);
  });



  /***************************************************************/
  /* ADD/DELETE ALBUM FUNCTIONS
  /***************************************************************/

  //add album
    $('#albumformbox #album_form').submit(function(){
        album = {
            client: current_user,
            user: album_owner,
            album_name: $('#alb_name').val().toString()
        };

        socket.emit('add_album', album);
        socket.emit('album_change', album);
        socket.emit('get_albums', album_owner);
        return false;
    });

    socket.on('album_change', function(album) {
      if(album_owner === album.user && current_user != album.user) {
        socket.emit('get_albums', album_owner);
      }
    });

    //clean up form on close/cancel
    $('#albumformbox').on('click', 'button[type=\'button\']',function(){
        $('#alb_name').val('');
        $('#error_text').text('');
    });

    //clean form on successful addition of form and close modal
    socket.on('clean_album_form', function(){
        $('#alb_name').val('');
        $('#error_text').text('');
        $('#albumformbox').modal("toggle");
    });


    //delete album
    $('#album-list').on('click', '.del_alb', function(event){
        var target = event.target.parentNode.parentNode || event.srcElement;
        let albname = target.innerText;
        event.stopPropagation();

        deleteAlbumDialog(albname);
        $('#deletebox').modal("show");

    });

    //delete dialog
    function deleteAlbumDialog(name) {
        let del_msg_html = "<p>Are you sure you want to delete this album and all its images?</p>";
        del_msg_html += "<button type='button' id='alb_del_btn' class='btn btn-default' data-dismiss='modal'>Delete</button>";
        del_msg_html += "<button type='button' id='alb_cancel2' class='btn btn-default' data-dismiss='modal'>Cancel</button>";

        $('#del_this_title').text(name);
        $('#del_msg').html(del_msg_html);

        //cancel button
        $('#alb_cancel2').on('click', function(){
            $('#del_msg').html('');
            $('#deletebox').modal("hide");
        });

        //delete album
        $('#alb_del_btn').on('click', function(){
            album = {
                client: current_user,
                user: album_owner,
                album_name: name
            };

            socket.emit('delete_album', album);
            socket.emit('album_change', album);
            socket.emit('get_albums', album_owner);
        });

    }

    /***************************************************************/
    /* DELETE IMAGE FUNCTIONS
    /***************************************************************/

    //delete image from sidebar
    $('#album-list').on('click', '.del_img_side', function(event){
        var target = event.target.parentNode.parentNode || event.srcElement;
        let imgname = target.innerText;
        deleteDialog(imgname.trim());

        let size = window.getComputedStyle(document.body,':after').getPropertyValue('content').replace( /"/g, '' ); //http://adactio.com/journal/5429/

        /* http://codepen.io/bradfrost/pen/tfCAp */
        if(size == "widescreen") {
            event.preventDefault();
            image = {
                client: current_user,
                user: album_owner,
                album_name: current_album,
                img_name: imgname.trim()
            };

            socket.emit('get_image', image);
            $('#lightbox').modal("show");
        } else {
            $('#deletebox').modal("show");
        }
    });

    //delete image from main area
    $('#album-images').on('click', '.del_img', function(event){
        let size = window.getComputedStyle(document.body,':after').getPropertyValue('content').replace( /"/g, '' ); //http://adactio.com/journal/5429/
        //get image name
        var target = event.target.parentNode.parentNode.parentNode.parentNode || event.srcElement;
        let imgname_html = target.innerHTML.toString();
        let start_str = imgname_html.indexOf("alt=") + 5;
        let end_str = imgname_html.indexOf("></div>") - 1;
        let imgname = imgname_html.substring(start_str,end_str);

        deleteDialog(imgname.trim());

        /* http://codepen.io/bradfrost/pen/tfCAp */
        if(size == "widescreen") {
            event.preventDefault();
        } else {
            $('#deletebox').modal("show");
            $('#deletebox').css({
              'maxWidth': $(window).width() - 100,
              'maxHeight': $(window).height() - 100
            });
        }
    });

    //delete dialog
    function deleteDialog(name) {
        let size = window.getComputedStyle(document.body,':after').getPropertyValue('content').replace( /"/g, '' ); //http://adactio.com/journal/5429/
        let del_msg_html = "<p>Are you sure you want to delete this?</p>";
        del_msg_html += "<button type='button' id='img_del_btn' class='btn btn-default' data-dismiss='modal'>Delete</button>";
        del_msg_html += "<button type='button' id='img_cancel2' class='btn btn-default' data-dismiss='modal'>Cancel</button>";

        /* http://codepen.io/bradfrost/pen/tfCAp */
        if(size == "widescreen") {
            //edit in delete dialog box
            $('#del_img_msg').html(del_msg_html);
        } else {
            $('#del_this_title').text(name);
            $('#del_msg').html(del_msg_html);
        }

        // when lightbox is closed, clear
        $('#lightbox').on('hidden.bs.modal', function (e) {
            $('#del_img_msg').html('');
            $('#del_msg').html('');
            $('#deletebox').modal("hide");
        });

        //delete image
        $('#img_del_btn').on('click', function(){
            image = {
                client: current_user,
                user: album_owner,
                album_name: current_album,
                img_name: name
            };

            socket.emit('delete_image', image);
            socket.emit('album_change', album);
            socket.emit('get_albums', album_owner);
        });

    }



  /***************************************************************/
  /* ADD IMAGE FUNCTIONS
  /***************************************************************/
    $('#album-images').on('click','.add-btn', function(){
        console.log("HELLO " + current_album);
        $('#editor_title').text("Create New Image In " + current_album);
    });


    function addImageToDB(img_name, img_src) {
        let alb_name = $("#album-name").text();
        console.log(alb_name);

        image = {
            client: current_user,
            user: album_owner,
            album_name: current_album,
            img_name: img_name,
            img_src: img_src
        };

        socket.emit('add_image', image);
        socket.emit('album_change', album);
        socket.emit('get_albums', album_owner);
    }

/***************************************************************/
/* IMAGE EDITOR FUNCTIONS
/***************************************************************/
	var canvas = new fabric.Canvas('canvas');
	var imgBackground;
	var url = "";
  //
  // function Canvas(id) {
  //   this.canvas = document.createElement('canvas');
  //   this.canvas.id = id;
  //   document.body.appendChild(this.canvas);
  //   return this.canvas;
  // }

	// imageLoader.addEventListener('change', uploadImage);
	$('#imageLoader').on('change',function (e) {
	    let argh = $('#editor_title').text();
        console.log(argh);
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.onload = function (f) {
			var data = f.target.result;
			fabric.Image.fromURL(data, function (img) {
				var oImg = img.set({left: 0, top: 0, angle: 00}).scale(0.25);
				imgBackground = oImg;

				canvas.add(oImg).renderAll();
				var a = canvas.setActiveObject(oImg);
				var dataURL = canvas.toDataURL({format: 'png', quality: 1.0});
			});
		 };
		 reader.readAsDataURL(file);
		 $('#imageLoader').hide();
		 $('#editor').show();
		 $('#setBg').show();
	 });

	 // set image function
	 $('#setBg').on('click', setBackground);
	 function setBackground() {
	 	imgBackground.set('selectable', false);
	 	imgBackground.set('evented', false);
		$('#setBg').hide();
		$('#editor-menu').show();
	 }

	 // save image function
	 $('#saveImg').on('click', saveImg);
	 function saveImg() {
    console.log('export image');
			if (!fabric.Canvas.supports('toDataURL')) {
      alert('This browser doesn\'t provide means to serialize canvas to an image');
    }
    else {
      window.open(canvas.toDataURL('png'));

      let imageName = "test";
      let imageData = canvas.toDataURL('png');

      addImageToDB(imageName, imageData);
    }
	}

	$('#deleteObject').on('click', deleteObject);
	function deleteObject() {
		canvas.getActiveObject().remove();
	}

	// Overlay stuff
	// Open when someone clicks on the span element
	$('#stickers').on('click', openStickers);
	function openStickers() {
		$('#sticker-nav').css("width", "100%");
	}

	// Close when someone clicks on the "x" symbol inside the overlay
	$('.closebtn').on('click', closeStickers);
	function closeStickers() {
		$('#sticker-nav').css("width", "0%");
	}

	function addSticker(url) {
		fabric.Image.fromURL(url, function(myImg) {
			myImg.set('left', 50);
			myImg.set('top', 40);
			myImg.scale(0.8);
			canvas.add(myImg);
		});
	}

	$('#sticker1').on('click', function() {
		url = "editor/stickers/big-heart.png";
		addSticker(url);
	});

	$('#sticker2').on('click', function() {
		url = "editor/stickers/Frederick.png";
		addSticker(url);
	});

	$('#sticker3').on('click', function() {
		url = "editor/stickers/rainbow.png";
		addSticker(url);
	});

	$('#sticker4').on('click', function() {
		url = "editor/stickers/sparkles.png";
		addSticker(url);
	});

  /***************************************************************/
  /* SEARCH FUNCTIONS
  /***************************************************************/

  $(".navbar-form").on('submit', function(e) {
    e.preventDefault();
    var $inputs = $('.navbar-form :input');
    socket.emit("get_user", $inputs[0].value);

  });

  socket.on('get_user', function(response) {
    if(response[0] != undefined) {
      $('.search-input').val("");
      album_owner = response[0].user;
      $("#album-owner").text(album_owner);
      socket.emit("get_albums", album_owner);
    } else {
      $('#error-msg-modal').html("This user does not exist.");
      $('#error-msg-box').modal('show');
    }
  });

  //https://codepen.io/nikhil/pen/qcyGF
  function toggle_search() {
    let submit = $('.input-group-btn');
    let searchBox = $('.search-bar');
    let input = $('.search-input');
    let isOpen = false;

    submit.click(function() {
      if(isOpen) {
        let val = input.val();
        if(val === "") {
          isOpen = false;
          searchBox.removeClass('search-bar-open');
          searchBox.addClass('search-bar-closed');
          input.focusout();
        } else {
          $(".navbar-form").submit();
        }
      } else {
        isOpen = true;
        searchBox.removeClass('search-bar-closed');
        searchBox.addClass('search-bar-open');
      }

      return false; //to prevent "form" from submitting
  })};


  /***************************************************************/
  /* SERVER MESSAGES
  /***************************************************************/

  socket.on('message', function(msg){
      if (msg.includes("ALBUM")) {
          $('#albumformbox #error_text').text(msg);
          console.log(msg);
      } else if (msg.includes("ALBUM")) {
          $('#editorbox #error_text_img').text(msg);
          console.log(msg);
      } else {
          console.log(msg);
      }
  });

});
