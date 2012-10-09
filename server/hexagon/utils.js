exports.fixStyles = function (styles) {
    var keys = Object.getOwnPropertyNames(styles);
    if (styles[keys[0]] == styles[keys[1]]) {
        styles[keys[0]] = {
            orange: 'red',
            purple: 'blue'
        }[styles[keys[0]]];
    }
};
