
const profit = $('#profit');
const soldItens = $('#sold-itens');
const dinheiro = $('#dinheiro');
const cheque = $('#cheque');


$.get('http://127.0.0.1:8000/sale/return_infos').done(function (back) {
    initializeChart(back);
    profit.text("R$ " + back['soma'].toFixed(2));
    dinheiro.text("R$ " + back['total_dinheiro'].toFixed(2));
    cheque.text("R$ " + back['total_cheque'].toFixed(2));
});

function initializeChart(data) {
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
                            label: "Quantidade vendida",
                            data: data['vendas_semana'].reverse(),
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
                            data: [720, 120, 10, 10],
                            backgroundColor: [
                                '#00b5e9',
                                '#fa4251',
                                '#ffeee2',
                                "#abABab"
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
                    labels: [
                        'Products',
                        'Services',
                        'bla',
                        'bla'
                    ]
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


