const profit = $('#profit');
const soldItens = $('#sold-itens');
const dinheiro = $('#dinheiro');
const cheque = $('#cheque');
const colExpand = $('.columns-expand');
const colCollapse = $('.columns-collapse');
const table = $('#table-sales');

let hash = window.location.hash.slice(1);
window.__args__ = Object.freeze(JSON.parse(decodeURIComponent(hash)));

const back = window.__args__;
const remote = require('electron').remote;

(function ($) {
    // USE STRICT
    "use strict";
    $("#navbar").load("../html/navbar_adm.html");
    initializePage(back, "");
})(jQuery);

var user_request = {
    'Vendedor_id': remote.getGlobal('Vendedor_id')
};

$.get(remote.getGlobal('default_url') + 'login/get', user_request).done(function(back) {
    if (!back.error && back.first_name && back.last_name) {
        $('#user_name').text(`, ${back.first_name} ${back.last_name}!`);
    } else if (!back.error && back.first_name) {
        $('#user_name').text(`, ${back.first_name}!`);
    } else {
        $('#user_name').text('!');
    }
});

$('#dashboad-options').on('click', 'li', function () {
    let store = $(this).text();
    if (store === "Central") {
        store = "";
        colExpand.removeClass('col-lg-6');
        colExpand.addClass('col-lg-4');
        colCollapse.css('display', 'block');
    } else {
        colExpand.removeClass('col-lg-4');
        colExpand.addClass('col-lg-6');
        colCollapse.css('display', 'none');
    }
    initializePage(store, false);
    $('#text-dash').text($(this).text());
});

function initializePage(back, store) {
    initializeChart(back, store);
    soldItens.text(back['itens']);
    profit.text("R$ " + back['lucro'].toFixed(2));
    dinheiro.text("R$ " + back['dinheiro_caixa'].toFixed(2));
    cheque.text("R$ " + back['cheque_caixa'].toFixed(2));

    updateTable(back)

}

function updateTable(data) {
    let list = {
        'Verbo Divino': data['Verbo Divino'][0],
        'Aldeia da Serra': data['Aldeia da Serra'][0],
        'Itaim': data['Itaim'][0],
        'Aclimação': data['Aclimação'][0]
    };
    var sortable = [];
    for (var vehicle in list) {
        sortable.push([vehicle, list[vehicle]]);
    }

    sortable.sort(function (a, b) {
        return a[1] - b[1];
    });

    sortable.reverse().forEach(function (p, i) {
        table.append("<tr><td>" + i + ". " + p[0] + "</td><td>R$ " + p[1].toFixed(2) + "</td></tr>");
    });
}

function initializeChart(data, store) {
    // USE STRICT
    "use strict";

    try {
        //WidgetChart 5
        var ctx = document.getElementById("widgetChart5");
        if (ctx) {
            ctx.height = 220;
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data['dias'].reverse(),
                    datasets: [
                        {
                            label: "Receita obtida",
                            data: data[store].reverse(),
                            borderColor: "transparent",
                            borderWidth: ".5",
                            backgroundColor: "#ccc",
                        }
                    ]
                },
                options: {
                    maintainAspectRatio: true,
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            categoryPercentage: 1,
                            barPercentage: 0.7
                        }],
                        yAxes: [{
                            display: false
                        }]
                    }
                }
            });
        }

    } catch (error) {
        console.log(error);
    }

    try {

        // Percent Chart 2
        let ctx2 = document.getElementById("percent-chart2");
        if (ctx2) {
            ctx2.height = 209;
            let myChart2 = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    datasets: [
                        {
                            label: "My First dataset",
                            data: data['forma_de_pagamento'],
                            backgroundColor: [
                                '#00b5e9',
                                '#fa4251',
                                '#ffeee2',
                                "#abABab",
                                '#009900'
                            ],
                            borderWidth: [
                                0, 0
                            ],
                            hoverBorderColor: [
                                'transparent',
                                'transparent'
                            ]
                        }
                    ],
                    labels: data['opcoes_de_pagamento']
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    cutoutPercentage: 87,
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    },
                    legend: {
                        display: false,
                        position: 'bottom',
                        labels: {
                            fontSize: 14,
                            fontFamily: "Poppins,sans-serif"
                        }

                    },
                    tooltips: {
                        titleFontFamily: "Poppins",
                        xPadding: 15,
                        yPadding: 10,
                        caretPadding: 0,
                        bodyFontSize: 16,
                    }
                }
            });
        }

    } catch (error) {
        console.log(error);
    }


}


(function ($) {
    // USE STRICT
    "use strict";
    $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 900,
        outDuration: 900,
        linkElement: 'a:not([target="_blank"]):not([href^="#"]):not([class^="chosen-single"])',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'page-loader',
        loadingInner: '<div class="page-loader__spin"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: ['animation-duration', '-webkit-animation-duration'],
        overlay: false,
        overlayClass: 'animsition-overlay-slide',
        overlayParentElement: 'html',
        transition: function (url) {
            window.location.href = url;
        }
    });


})(jQuery);

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




