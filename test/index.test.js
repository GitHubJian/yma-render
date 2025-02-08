const {Render} = require('../src');

const vm = new Render({
    render: h => h(App),
}).$mount(document.body);

vm.show(document.body);
