/**
 * escape regular expression char with '\'
 * @param
 *   @value {String} 
 * @return {String}
 */
module.exports = (value) => {
    return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
