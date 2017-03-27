$(function() {
  toggle_search();
})

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
