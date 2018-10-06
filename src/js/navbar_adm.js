const {ipcRenderer} = require('electron');
const {getCurrentWindow} = require('electron').remote;
const remote = require('electron').remote;

$.get(remote.getGlobal('default_url') + 'login/get', {'Vendedor_id': remote.getGlobal('Vendedor_id')}).done(function(back){
    if (!back.error && back.avatar && back.user_name){
        $('.profile_picture').attr('src', back.avatar);
    } else {
        $('.profile_picture').attr('src', '../../public/images/user_icon.png');
    }
    $('.profile_picture').attr('alt', back.user_name);

    if (!back.error && back.first_name && back.last_name) {
        $('.user_name').text(`${back.first_name} ${back.last_name}`);
    } else if (!back.error && back.first_name) {
        $('.user_name').text(`${back.first_name}`);
    } else {
        $('.user_name').text('Usuário desconhecido');
    }

    if (!back.error && back.email){
        $('#user_email').text(back.email);
    } else{
        $('#user_email').text('e-mail desconhecido');
    }
});

$('#dashboad-options').on('click', 'li', function () {
    let store = $(this).text();
    if (store === "Central")
        store = "";
    $.get(remote.getGlobal('default_url') + "sale/return_infos", {'loja': store}).done(function (back) {
        back['url'] = 'dashboard.html';
        ipcRenderer.send('update-window', back)
    })
});

$('#to-product').on('click', function () {
    ipcRenderer.send('update-window', {'url': 'add_product.html'})
});

$('#to-report').on('click', function () {
    ipcRenderer.send('update-window', {'url': 'reports_menu.html', 'from': 'adm'})
});

$('#to-storage').on('click', function () {
    ipcRenderer.send('update-window', {'url': 'storage.html'})
});

$('#to-prediction').on('click', function() {
    ipcRenderer.send('update-window', {'url': 'previsao.html'})
});

$('#logout').on('click', function () {
    ipcRenderer.send('update-window', {'url': 'login.html'})
});

(function ($) {
    // USE STRICT
    "use strict";

    // Dropdown
    try {
        var menu = $('.js-item-menu');
        var sub_menu_is_showed = -1;

        for (var i = 0; i < menu.length; i++) {
            $(menu[i]).on('click', function (e) {
                e.preventDefault();
                $('.js-right-sidebar').removeClass("show-sidebar");
                if (jQuery.inArray(this, menu) == sub_menu_is_showed) {
                    $(this).toggleClass('show-dropdown');
                    sub_menu_is_showed = -1;
                }
                else {
                    for (var i = 0; i < menu.length; i++) {
                        $(menu[i]).removeClass("show-dropdown");
                    }
                    $(this).toggleClass('show-dropdown');
                    sub_menu_is_showed = jQuery.inArray(this, menu);
                }
            });
        }
        $(".js-item-menu, .js-dropdown").click(function (event) {
            event.stopPropagation();
        });

        $("body,html").on("click", function () {
            for (var i = 0; i < menu.length; i++) {
                menu[i].classList.remove("show-dropdown");
            }
            sub_menu_is_showed = -1;
        });

    } catch (error) {
        console.log(error);
    }

    var wW = $(window).width();
    // Right Sidebar
    var right_sidebar = $('.js-right-sidebar');
    var sidebar_btn = $('.js-sidebar-btn');

    sidebar_btn.on('click', function (e) {
        e.preventDefault();
        for (var i = 0; i < menu.length; i++) {
            menu[i].classList.remove("show-dropdown");
        }
        sub_menu_is_showed = -1;
        right_sidebar.toggleClass("show-sidebar");
    });

    $(".js-right-sidebar, .js-sidebar-btn").click(function (event) {
        event.stopPropagation();
    });

    $("body,html").on("click", function () {
        right_sidebar.removeClass("show-sidebar");

    });


    // Sublist Sidebar
    try {
        var arrow = $('.js-arrow');
        arrow.each(function () {
            var that = $(this);
            that.on('click', function (e) {
                e.preventDefault();
                that.find(".arrow").toggleClass("up");
                that.toggleClass("open");
                that.parent().find('.js-sub-list').slideToggle("250");
            });
        });

    } catch (error) {
        console.log(error);
    }


    try {
        // Hamburger Menu
        $('.hamburger').on('click', function () {
            $(this).toggleClass('is-active');
            $('.navbar-mobile').slideToggle('500');
        });
        $('.navbar-mobile__list li.has-dropdown > a').on('click', function () {
            var dropdown = $(this).siblings('ul.navbar-mobile__dropdown');
            $(this).toggleClass('active');
            $(dropdown).slideToggle('500');
            return false;
        });
    } catch (error) {
        console.log(error);
    }
})(jQuery);
