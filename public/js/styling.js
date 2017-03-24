$(function() {
  handle_search();

  //   var submitIcon = $('.searchbox-icon');
  //   var inputBox = $('.searchbox-input');
  //   var searchBox = $('.searchbox');
  //   var isOpen = false;
  //   submitIcon.click(function(){
  //     if(isOpen == false){
  //         searchBox.addClass('searchbox-open');
  //         inputBox.focus();
  //         isOpen = true;
  //     } else {
  //         searchBox.removeClass('searchbox-open');
  //         inputBox.focusout();
  //         isOpen = false;
  //     }
  //   });
  //   submitIcon.mouseup(function(){
  //         return false;
  //   });
  //   searchBox.mouseup(function(){
  //         return false;
  //   });
  //   $(document).mouseup(function(){
  //     if(isOpen == true){
  //       $('.searchbox-icon').css('display','block');
  //       submitIcon.click();
  //     }
  //   });
  // });
  //
  // function buttonUp(){
  //   var inputVal = $('.searchbox-input').val();
  //   inputVal = $.trim(inputVal).length;
  //   if( inputVal !== 0){
  //     $('.searchbox-icon').css('display','none');
  //   } else {
  //     $('.searchbox-input').val('');
  //     $('.searchbox-icon').css('display','block');
  // }
});

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
