
$(function() {
  toggle_search();

  // https://www.codeply.com/go/632RvEWJ6P
  $('[data-toggle="offcanvas"]').click(function () {
    $('.row-offcanvas').toggleClass('active')
  });
});


/* http://bootsnipp.com/snippets/featured/bootstrap-lightbox */
function buildLightBox(src, name) {
  let $lightbox = $('#lightbox');
  let css = {
    'maxWidth': $(window).width() - 100,
    'maxHeight': $(window).height() - 100
  };

  $lightbox.find('.close').addClass('hidden');
  $lightbox.find('img').attr('src', src);
  $lightbox.find('img').attr('alt', name);
  $lightbox.find('img').css(css);

  $('#modal-img-title').text(name);
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
