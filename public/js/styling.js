$(function() {
  handle_search();
});

//https://codepen.io/nikhil/pen/qcyGF

function handle_search() {
  let searchBox = $('.search-bar');
  let input = $('.search-input');
  let submit = $('.search-btn');
  let isOpen = false;

  submit.click(function() {
    if(isOpen) {
      isOpen = false;
      searchBox.removeClass('search-bar-open');
      searchBox.addClass('search-bar-closed');
      input.focusout();
    } else {
      isOpen = true;
      searchBox.removeClass('search-bar-closed');
      searchBox.addClass('search-bar-open');
    }
  });
}
