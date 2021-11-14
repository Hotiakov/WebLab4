// @flow

const fs = require("fs");
exports.idGenerator = () => '_' + Math.random().toString(36).substr(2, 9);

exports.findIdItem = (paintings, id) => {
    for(let i = 0; i < paintings.length; i++){
        if(paintings[i].id === id){
            return paintings[i];
        }
    }
    return {};
}

exports.findNameItem = (item, name) => {
    for (let i = 0; i < item.length; i++) {
        if (item[i].name === name) {
            return item[i];
        }
    }
    return {};
}

exports.findNameIndex = (item, name) => {
    for (let i = 0; i < item.length; i++) {
        if (item[i].name === name)
            return i;
    }
    return -1;
};

exports.findIdIndex = (paintings, id) => {
    for(let i = 0; i < paintings.length; i++){
        if(paintings[i].id === id)
            return i;
    }
    return -1;
};

exports.writeToFile = (file = './server/json/db.json', paintingJson) => {
    try{
        fs.writeFile(file, paintingJson, (err) => {
            if (err) throw err;
            console.log('База данных успешно обновлена');
        });
    } catch (err) {
        console.error(err);
    }
}

exports.sortAuction = (a, b) => {
    if(b.isInAuction)
        return 1;
    return -1;
}