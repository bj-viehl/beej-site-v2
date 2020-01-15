$( document ).ready(function() {
    $('.beej-accordion__item').on('click', '.beej-accordion__item-title', function() {
        var accordionOpen = $(this).parent().hasClass('beej-accordion__item--open');

        if (accordionOpen == true) {
            $(this).parent().removeClass('beej-accordion__item--open');
        } else {
            $(this).parent().addClass('beej-accordion__item--open');
        }

       $(this).siblings('.beej-accordion__item-content').slideToggle();
    });
});