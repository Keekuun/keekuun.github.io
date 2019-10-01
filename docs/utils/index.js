const utils = {
    genSiderbar: function(title, children = [''], collapse=true, sidebarDepth=3) {
        return {
            title,
            collapse,
            sidebarDepth,
            children
        }
    }
};

module.exports = utils;