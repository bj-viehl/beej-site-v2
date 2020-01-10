$( document ).ready(function() {
    function checkWidth() {
      console.log('Window width is' + $(window).width() );
    }

    $('.beej-header__menu-button').on('click', function() {
       var windowWidth = $(window).width();

       if (windowWidth < 768) {
           var navOpen = $('.beej-header').hasClass('beej-header--open');

           if (navOpen == true) {
               $('.beej-header').removeClass('beej-header--open');
           } else {
               $('.beej-header').addClass('beej-header--open');
           }

           $('.beej-header__nav').slideToggle('fast');
       }

      $(window).on('resize', function(){
          checkWidth();
      });

    });
});