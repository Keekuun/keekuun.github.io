const front = require('./frontConfig/index.js');
const back = require('./backConfig/index.js');
module.exports = {
    "/frontEnd/css/": front.css,
    "/frontEnd/html/": front.html,
    "/frontEnd/javascript/": front.js,
    "/backEnd/node/": back.node,
};