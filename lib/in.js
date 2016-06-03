/**
 * in.js
 * @author Eyson
 */
'use strict';

var In = module.exports = {};

/**
 * 判断某个传是否在数组里
 * @param  {array} arr 一个数组
 * @param  {mix}   val 一个值
 * @return {boolean}
 */
In.array = function(arr, val){
    arr = arr || [];
    return (arr.indexOf(val) != -1) ? true : false;
};

In.object = function(obj, key){
    obj = obj || {};
    return obj[key] ? true : false;
}

In.string = function(str, val){
    str = str || '';
    return (str.indexOf(val) != -1) ? true : false;
}