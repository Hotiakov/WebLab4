// @flow
require('jquery');
require('webpack-jquery-ui/css');
require('webpack-jquery-ui/resizable');

require('../less/admin.less');

const Rollbar = require("rollbar");
const rollbar = new Rollbar({
    accessToken: 'a57b1ea69ee54b08b5578639e9efde73',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: 'production'
    }
});


const { io } = require("socket.io-client");

$(document).ready(() => {
    $(".participants").resizable({
        minWidth: 250
    });

    $(".paintings").resizable({
        minWidth: 250
    });

    $(".trading").resizable({
        minWidth: 250
    });

    $(".painting").resizable({
        minWidth: 250
    });
    
    
    const updateParticipants = data => {
        $('.participants__list').html(`
            <li class="participants__item list__item"> 
                <p class="list__header participants__name participants__text">Имя участника</p>
                <p class="list__header participants__budget participants__text">Бюджет</p>
            </li>
        `);
        data.forEach(item => {
            $('.participants__list').append(`
                <li class="participants__item list__item">
                    <p class="participants__name participants__text">${item.name}</p>
                    <p class="participants__budget participants__text">${item.capital}</p>
                </li>
            `);
        })
    };
    const updatePaintings = data => {
        $('.paintings__list').html(`
            <li class="paintings__item list__item"> 
                <p class="list__header paintings__name paintings__text">Название картины</p>
                <p class="list__header paintings__author paintings__text">Автор</p>
                <p class="list__header paintings__minPrice paintings__text">Минимальная цена</p>
                <p class="list__header paintings__owner paintings__text">Покупатель</p>
                <p class="list__header paintings__salePrice paintings__text">Цена продажи</p>
            </li>
        `);
        data.forEach(item => {
            $('.paintings__list').append(`
                <li class="paintings__item list__item">
                    <p class="paintings__name paintings__text">${item.name}</p>
                    <p class="paintings__author paintings__text">${item.author}</p>
                    <p class="paintings__minPrice paintings__text">${item.startPrice}</p>
                    <p class="paintings__owner paintings__text">${item.owner}</p>
                    <p class="paintings__salePrice paintings__text">${item.salePrice}</p>
                </li>
            `);
        });
    }

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
        rollbar.log('Обновлена картина');
        
    };

    $.get(`${window.location.href}/participants`)
        .done((data) => {updateParticipants(data); rollbar.log('Получены данные участников')})
        .fail((err) => rollbar.error(err));
    $.get(`${window.location.href}/paintings`)
        .done((data) => { updatePaintings(data); rollbar.log('Получены данные картин')})
        .fail((err) => rollbar.error(err));

    const socket = io("http://localhost:3030", { transports: ['websocket', 'polling', 'flashsocket'] });
    
    socket.on('info', (text, color) => {
        $('.trading').append(`
            <p class="trading__info ${color}">${text}</p>
        `);
    });

    socket.on('painting', updatePainting);

    socket.on('paintingsToAdmin', updatePaintings);

    socket.on('participantsToAdmin', updateParticipants);
});



