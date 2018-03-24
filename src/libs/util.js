import _ from 'lodash';
import moment from 'moment';
import helper from './lib/helper'
import ajax from './lib/ajax'




let util = {

};
util.title = function(title) {
    title = title ? title + ' - Home' : 'iView project';
    window.document.title = title;
};

util.helper = new helper();
util._=_;
util.ajax = new ajax();
util.moment=moment;

export default util;