
$(function() {

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
    $lightbox.find('.modal-dialog').css({'width': $img.width() + 30});
    $lightbox.find('.close').removeClass('hidden');
  });
}
