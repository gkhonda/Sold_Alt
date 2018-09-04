require('electron-window').parseArgs();
console.log(window.__args__);

const paymentList = $('#payment-list');
const storeSpan = $('#loja')
const paymentDetails = window.__args__['forma_de_pagamento'];
const stores = window.__args__['lojas'];
const sum = window.__args__['total'];
const store = window.__args__['store'];

storeSpan.text(store);

for (let i = 0; i < paymentDetails.length; i++) {
    paymentList.append("<li>" + stores[i] + "<span id='price'>R$" + paymentDetails[i].toFixed(2) + "</span></li>");
}

paymentList.append("<li>" + "Total" + "<span id='price'>R$" + sum.toFixed(2) + "</span></li>");

initializeChart(window.__args__);
function initializeChart(data) {
    // USE STRICT
    "use strict";

    try {
        //WidgetChart 5
        var ctx = document.getElementById("widgetChart5");
        if (ctx) {
            ctx.height = 220;
            let myChart = new Chart(ctx, {
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
                            borderWidth: 1,
                        }
                    ],
                    labels: data['lojas']
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    cutoutPercentage: 80,
                    animation: {
                        animateScale: false,
                        animateRotate: false
                    },
                    legend: {
                        display: true,
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
                        callbacks: {
                            label: function (tooltipItem, data) {
                                //get the concerned dataset
                                var dataset = data.datasets[tooltipItem.datasetIndex];
                                //calculate the total of this data set
                                var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                                    return previousValue + currentValue;
                                });
                                //get the current items value
                                var currentValue = dataset.data[tooltipItem.index];
                                //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
                                var percentage = Math.floor(((currentValue / total) * 100) + 0.5);

                                return percentage + "%";
                            }
                        }
                    }
                }
            });
        }

    } catch (error) {
        console.log(error);
    }
}