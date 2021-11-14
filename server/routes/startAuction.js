// @flow

const properties = require('../json/properties.json');
let paintings = require('../json/db.json');
const owners = require('../json/owners.json');
let { findNameIndex, writeToFile } = require('../routes/secondaryFunction');

let participants = require('../json/participants.json');

const { Server } = require("socket.io");

const io = new Server();
io.listen(3030);
paintings = paintings.filter(item => item.isInAuction).map(item => {return { ...item, owner: '-', salePrice: '-' }});

const delay = async (ms) => await new Promise(resolve => setTimeout(resolve, ms));

exports.startAuction = async () => {
    let curPrice = 0, curOwner = '-', curStep = 0, curPainting, timeToStart = (Date.parse(properties.dateStart) - Date.now()) / 1000;
    let index = 0;
    io.on("connection", async socket => {
        const timeToWait = Math.floor((Date.parse(properties.dateStart) - Date.now()) / 1000);
        if (timeToWait < 0) {
            socket.emit('info', 'Аукцион уже идет!', 'black');
        }else{
            socket.emit('info', `Аукцион стартует в ${properties.dateStart}; Времени до аукциона: ${Math.floor(timeToWait / 60)} минут ${timeToWait % 60} секунд`, 'black');
        }
        socket.on('offer', (price, name) => {
            if (price > curPrice) {
                curPrice = price;
                curOwner = name;
                curStep++;
                io.emit('curPrice', curPrice);
                io.emit('info', `Участник ${name} предложил новую цену ${price}`, 'green');
                io.emit('info', `Текущий шаг: ${curStep}`, 'gray');
                if (curStep === +curPainting.maxStep) {
                    io.emit('info', 'Была сделана последняя ставка. Дождитесь окончания торга.', 'black');
                    io.emit('switchOff');
                }
            }
        });
    });

    const setOwner = (curStep, index, owner, curPrice) => {
        if (curStep < paintings[index].minStep) {
            io.emit('info', 'Не было сделано минимальное количество ставок. Картина не продана', 'red');
        }
        else {
            paintings[index] = { ...paintings[index], owner: owner, salePrice: curPrice }
            participants[findNameIndex(participants, owner)].capital -= curPrice;

            io.emit('info', `Картина была продана ${owner}`, 'green');
            io.emit('participantsToAdmin', participants);
            io.emit('paintingsToAdmin', paintings);
            io.emit('reduceBudget', owner, curPrice);

            if(!owners[owner])
                owners[owner] = [];
            owners[owner].push({ name: paintings[index].name, author: paintings[index].author, discription: paintings[index].discription, url: paintings[index].url});
            writeToFile('./server/json/owners.json', JSON.stringify(owners));
        }
    }

    await delay(timeToStart * 1000);//Ждем начало торгов
    io.emit('info', `Аукцион начался!`);
    for (let painting of paintings) {
        curPainting = painting;
        curPrice = painting.startPrice;
        io.emit('curPrice', curPrice);
        io.emit('info', `Картина: ${painting.name}, начальная цена: ${painting.startPrice}, минимальный количество ставок: ${painting.minStep}, максимальное количество: ${painting.maxStep}, время на торг: ${properties.intervalEnd} минуты`, 'black bold');
        io.emit('painting', painting);
        io.emit('info', `У вас ${properties.intervalResearch} минута на изучение картины`, 'black');
        await delay(properties.intervalResearch * 60 * 1000); //Запускаем время на осмотр картины
        io.emit('info', `Торг начался! У вас ${properties.intervalEnd} минуты`, 'black');
        io.emit('switchOn');
        await delay(properties.intervalEnd * 60 * 1000); //Ждем окончание торга
        io.emit('switchOff');
        io.emit('info', `Время торга вышло!`, 'black');
        setOwner(curStep, index, curOwner, curPrice); //устанавливаем нового владельца
        io.emit('info', `У вас ${properties.intervalBetween} минута на отдых`, 'black');
        await delay(properties.intervalBetween * 60 * 1000); //Отдых между торгами
        curOwner = '-';
        curStep = 0;
        index++;//следующая картина
    };
    io.emit('info', 'Торг по картинам окончен!', 'green bold');
}