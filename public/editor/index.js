$(document).ready(function() {

	var canvas = new fabric.Canvas('canvas');
	var imgBackground;
	var imageLoader = document.getElementById('imageLoader');
	var $uploadForm = $('#imageLoader');
	var url = "";

	imageLoader.addEventListener('change', uploadImage);
	function uploadImage(e) {
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.onload = function (f) {
			var data = f.target.result;
			fabric.Image.fromURL(data, function (img) {
				var oImg = img.set({left: 0, top: 0, angle: 00}).scale(0.25);
				imgBackground = oImg;

				canvas.add(oImg).renderAll();
				// canvas.sendToBack(oImg);
				// canvas.renderAll.bind(canvas);
				var a = canvas.setActiveObject(oImg);
				var dataURL = canvas.toDataURL({format: 'png', quality: 1.0});
			});
		 };
		 reader.readAsDataURL(file);
		 $('#imageLoader').hide();
		 $('#editor').show();
		 $('#setBg').show();
	 }

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
			console.log("We got here");
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
		url = "stickers/big-heart.png";
		addSticker(url);
	});

	$('#sticker2').on('click', function() {
		url = "stickers/Frederick.png";
		addSticker(url);
	});

	$('#sticker3').on('click', function() {
		url = "stickers/rainbow.png";
		addSticker(url);
	});

	$('#sticker4').on('click', function() {
		url = "stickers/sparkles.png";
		addSticker(url);
	});

});	// The closing bracket for jquery


	// load image
	// document.getElementById('imageLoader').addEventListener("change", function (e) {
	// 	var file = e.target.files[0];
	//   var reader = new FileReader();
	// 	reader.onload = function (f) {
	// 		var data = f.target.result;
	// 		fabric.Image.fromURL(data, function (img) {
	// 		  var oImg = img.set({left: 0, top: 0, angle: 00,width:100, height:100}).scale(0.9);
	// 		  canvas.add(oImg).renderAll();
	// 		  var a = canvas.setActiveObject(oImg);
	// 		  var dataURL = canvas.toDataURL({format: 'png', quality: 1.0});
	// 		});
	// 	 };
	// 	 reader.readAsDataURL(file);
	//  });

	//
	// $('#setBg').on('click', setBackground);
	// function setBackground() {
	// 	// imgBackground.onload = function(){
	//   //  canvas.setBackgroundImage(imgBackground.src, canvas.renderAll.bind(canvas), {
	//   //           originX: 'left',
	//   //           originY: 'top',
	//   //           left: 0,
	//   //           top: 0
	//   //       });
	// 	// 		};
	// 	//http://fabricjs.com/assets/jail_cell_bars.png
	// 	 canvas.setBackgroundImage($imgBackground, canvas.renderAll.bind(canvas), {
	// 	          originX: 'left',
	// 	          originY: 'top',
	// 	          left: 0,
	// 	          top: 0
	// 	  });
	// 		canvas.renderAll();
	// }


	//  $('#saveImg').attr({
	// 		'download': 'YourProduct.png',  /// set filename
	// 		'href'    : image              /// set data-uri
	// 	});

	//  function saveImg() {
  //   console.log('export image');
	// 		if (!fabric.Canvas.supports('toDataURL')) {
  //     alert('This browser doesn\'t provide means to serialize canvas to an image');
  //   }
  //   else {
  //     window.open(canvas.toDataURL('png'));
	// 		console.log("We got here");
  //   }
	// }

	// function saveImg() {
	// 	var myDrawing = document.getElementById("canvas");
	// 	var drawingString = myDrawing.toDataUrl("image/png");
	// 	var ajax = new XMLHttpRequest();
	// 	ajax.open("POST", 'saveImage.php', true);
	// 	ajax.setRequestHeader('Content-Type', 'canvas/upload');
	// 	ajax.onreadystatechange = function() {
	// 		if (ajax.readyState == 4) {alert ("image saved!")}
	// 	}
	// 	ajax.send(postData);
	// }
