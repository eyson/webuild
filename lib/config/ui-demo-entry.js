//ui demo entry

module.exports = (widgetName) => {
    return `import Vue from 'vue';
import ${widgetName} from '../index';

let App = new Vue({
    el: '#app',
    components: { ${widgetName} }
})`;
};
