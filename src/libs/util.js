import _ from 'lodash';
import ajax from './lib/ajax'
import helper from './lib/helper'


let util = {

};
util.title = function(title) {
    title = title ? title + ' - Home' : 'iView project';
    window.document.title = title;
};

util.ajax = new ajax();
util.helper = new helper();

util._=_;

export default util;