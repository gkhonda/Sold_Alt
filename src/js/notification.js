const remote = require('electron').remote;

$(function () {
    $("#navbar").load("../html/navbar_adm.html");
});

$.get(remote.getGlobal('default_url') + 'login/get', {'Vendedor_id': remote.getGlobal('Vendedor_id'), 'notification': true}).done(function(back) {

    back['all_notifications'].forEach(function (notification) {
        let open = notification.seen ? 'fa fa-envelope-open' : 'fa fa-envelope';
        $('.notification-list').append('<li><div class="row"><div class="col-sm-1"><i class="' + open + '" id="notification' + notification.id + '"></i></div><div class="col-sm-7"> <p>' + notification.title + '</p>' + '</div><div class="col-sm-3">' + notification.datetime.substring(0,10) + ': ' + notification.datetime.substring(11,16) + '</div><div class="col-sm-1"><i class="fa fa-external-link-alt"><span id="notificationId" style="display: none">' + notification.id + '</span> </i></div></div></div></li>')
    });

});

$('.notification-list').on('click', 'li .col-sm-1 .fa-external-link-alt',  function () {
    var id = $(this).find('#notificationId').text();
    $.get(remote.getGlobal('default_url') + 'notifications/read', {'id': id}).done(function (back) {
        $('#modal-notification-title').text(back['title']);
        $('#modal-notification-text').text(back['text']);
        $('#notification' + id).removeClass('fa-envelope');
        $('#notification' + id).addClass('fa-envelope-open');
        $('.modal').removeClass('invisible');
        $('.modal').addClass('block');
    })
});

$('.close').click(function () {
    $('.modal').addClass('invisible');
    $('.modal').removeClass('block');
});