const utils = {
    genSiderbar: function(title, children = [''], collapse=true, sidebarDepth=2) {
        return {
            title,
            collapse,
            sidebarDepth,
            children
        }
    }
};

module.exports = utils;