
$(function() {
  toggle_search();
  if ($('#lightbox').length != 0)
    lightboxInit();
});


function lightboxInit() {
  $('.thumbnail').click(function(e){
    let size = window.getComputedStyle(document.body,':after').getPropertyValue('content').replace( /"/g, '' ); //http://adactio.com/journal/5429/

    /* http://codepen.io/bradfrost/pen/tfCAp */
    if(size == "768") {
      e.preventDefault();
      var $img = $(this).find('img'),
          src = $img.attr('src');
      buildLightBox(src);
    }
  });
}


/* http://bootsnipp.com/snippets/featured/bootstrap-lightbox */
function buildLightBox(src) {
  let $lightbox = $('#lightbox');
  let css = {
    'maxWidth': $(window).width() - 100,
    'maxHeight': $(window).height() - 100
  };

  $lightbox.find('.close').addClass('hidden');
  $lightbox.find('img').attr('src', src);
  $lightbox.find('img').css(css);

  $('#lightbox').find('img').attr('src', src);
  $("#lightbox").modal('show');

  $lightbox.on('shown.bs.modal', function (e) {
    var $img = $lightbox.find('img');
    $lightbox.find('.modal-dialog').css({'width': $img.width()});
    $lightbox.find('.close').removeClass('hidden');
  });
}

//https://codepen.io/nikhil/pen/qcyGF
function toggle_search() {
  let submit = $('.search-btn');
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
        handle_search();
      }
    } else {
      isOpen = true;
      searchBox.removeClass('search-bar-closed');
      searchBox.addClass('search-bar-open');
    }

    return false; //to prevent "form" from submitting
  });
}

function handle_search() {
  console.log("hello");
}
