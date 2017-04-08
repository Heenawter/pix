$(document).ready(function() {

	var canvas = new fabric.Canvas('canvas');
	var imgBackground;
	var imageLoader = document.getElementById('imageLoader');
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
				// canvas.renderAll.bind(canvas);
				var a = canvas.setActiveObject(oImg);
				var dataURL = canvas.toDataURL({format: 'png', quality: 1.0});
			});
		 };
		 reader.readAsDataURL(file);
	 }
	 // save image function
	 $('#saveImg').on('click', saveImg);

	//  $('#saveImg').attr({
	// 		'download': 'YourProduct.png',  /// set filename
	// 		'href'    : image              /// set data-uri
	// 	});

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

	//http://kingofwallpapers.com/cute-dog/cute-dog-009.jpg
	$('#sticker1').on('click', addSticker_1);
	function addSticker_1() {
		fabric.Image.fromURL('http://i.imgur.com/MxRBLKk.png', function(myImg) {
			myImg.set('left', 50);
			myImg.set('top', 40);
			myImg.scale(0.4);
			canvas.add(myImg);
		});
	}

	$('#deleteObject').on('click', deleteObject);
	function deleteObject() {
		canvas.getActiveObject().remove();
	}
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


	$('#setBg').on('click', setBackground);
	function setBackground() {
		imgBackground.set('selectable', false);
		imgBackground.set('evented', false);
	}


});


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
