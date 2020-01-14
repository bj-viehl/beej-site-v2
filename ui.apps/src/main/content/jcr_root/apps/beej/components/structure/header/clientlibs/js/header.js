$( document ).ready(function() {
    $('.beej-header__menu-button').on('click', function() {
        var navOpen = $('.beej-header').hasClass('beej-header--open');

        if (navOpen == true) {
            $('.beej-header').removeClass('beej-header--open');
        } else {
            $('.beej-header').addClass('beej-header--open');
        }

        $('.beej-header__menu').slideToggle('fast');
    });

    function desktopMenu() {
        var windowWidth = $(window).width();

        if (windowWidth > 900) {
            console.log('over 900 px');
            $('.beej-header__menu').show();
        }
    }

   $(window).resize(function() {
       desktopMenu();
   });
});