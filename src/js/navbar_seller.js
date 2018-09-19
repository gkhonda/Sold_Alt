$('#nav-img').click(function () {
    $('.total').toggleClass('block');
    $('.vertical-menu').toggleClass('open_drawer');
});

$(document).click(function(event) {
    //if you click on anything except the modal itself or the "open modal" link, close the modal
    if (!$(event.target).closest(".vertical-menu, #nav-img").length) {
        $("body").find(".total").removeClass("block");
        $('.vertical-menu').removeClass('open_drawer');
    }
});