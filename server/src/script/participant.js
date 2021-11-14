// @flow

require('jquery');
require('webpack-jquery-ui/css');
require('webpack-jquery-ui/resizable');
require('../less/participant.less');
const { io } = require("socket.io-client");

const Rollbar = require("rollbar");
const rollbar = new Rollbar({
    accessToken: 'a57b1ea69ee54b08b5578639e9efde73',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: 'production'
    }
});

$(document).ready(() => {
    const socket = io("http://localhost:3030", { transports: ['websocket', 'polling', 'flashsocket'] });

    $(".painting").resizable();

    $(".trading").resizable();

    const updatePainting = data => {
        $('.painting').html(`
            <div class="painting__img">
                <img src="..${data.url}" alt="${data.name}">
            </div>
            <div class="painting__info"> 
                <p class="painting__name painting__text"> <span>Название: </span>${data.name}</p>
                <p class="painting__author painting__text"> <span>Автор: </span>${data.author}</p>
                <p class="painting__discription painting__text"> <span>Описание: </span>${data.discription}</p>
                <p class="painting__minPrice painting__text"> <span>Минимальная цена: </span>${data.startPrice}</p>
            </div>
        `);

    };

    $.get(`${window.location.href}/data`).done(res => {
        $('.participant__name').text(`Имя: ${res.name}`);
        $('#hiddenName').val(res.name);
        $('.participant__budget').text(`Бюджет: ${res.capital}`);
        $('#budget').val(res.capital);
        console.log($('#hiddenName').val());
    });

    socket.on('info', (text, color) => {
        $('.trading').append(`
            <p class="trading__info ${color}">${text}</p>
        `);
    });

    socket.on('switchOff', () => {
        $('.participant__offer').prop('disabled', true);
        $("#modal").css("display", "none");
    });

    socket.on('switchOn', () => {
        $('.participant__offer').prop('disabled', false);
    });

    socket.on('curPrice', (price) => {
        $('#hiddenPrice').val(price);
    })

    socket.on('painting', updatePainting);

    socket.on('reduceBudget', (name, price) => {
        if ($('#hiddenName').val() === name){
            $('.participant__budget').text(`Бюджет: ${$('#budget').val() - price}`);
            $('#budget').val($('#budget').val() - price);
        }
    });

    $("#modal").on('click', e => {
        if (e.target.closest('.button__close') || e.target.closest('.cancel-button') || e.target.matches('.modal__overlay')) {
            $("#modal").css("display", "none");
        }
    });

    $('.participant__offer').on('click', () => {
        if(+$('#budget').val() < +$('#hiddenPrice').val()){
            alert('У вас недостаточно средств для новой ставки');
        } else{
            $('#price').val(+$('#hiddenPrice').val() + 1);
            $('#modal').css('display', 'flex');
        }
    });

    $('#price__form').submit(e => {
        e.preventDefault();
        const name = $('#hiddenName').val();
        const price = $('#price').val();
        if(price <= $('#hiddenPrice').val()){
            alert('Текущая цена меньше текущей ставки');
        } else{
            socket.emit('offer', price, name);
            $('#modal').css('display', 'none');
            rollbar.log("Новая цена была предложена!");
        }
    });

    $('.participant__gallery').on('click', () => {
        window.location.href = window.location.href + '/gallery';
    })
});