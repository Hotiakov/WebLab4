require('jquery');
require('../less/participantGallery.less');

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
    $.get(`${window.location.href}/data`, (paintings) => {
        $('.paintings__wrapper').html('');
        paintings.forEach(painting => {
            $('.paintings__wrapper').append(`
                <div class="paintings__item">
                    <div class="paintings__content">
                        <img class="paintings__img" src="../..${painting.url}" alt="${painting.name}">
                    </div>
                    <div class="paintings__text"> 
                        <h3 class="paintings__name">${painting.name}</h3>
                        <h4 class="paintings__author">${painting.author}</h4>
                        <p class="paintings__discription">${painting.discription}</p>
                    </div>
                </div>
            `)
        });
    })
    .fail(err => {
        rollbar.error(err);
    });
});