# YMA Render

函数式渲染 HTML 节点

## Install

```sh
npm install yma-render
```

## Usage

```js
const {Render, setStyle} = require('yma-render');

const vm = Render({
    render: function (createElement) {
        // 创建 DIV 节点
        return createElement(
            'div',
            {
                ref: 'div',
                class: {
                    'yma-div': true,
                },
                style: {
                    display: 'block',
                },
                on: {
                    click: function () {},
                },
            },
            [
                // 创建文本节点
                createElement(null, {}, 'Hello, world'),
            ]
        );
    },
});

// 对 div 的引用
const divEl = vm.$ref.div;
setStyle(divEl, {
    display: 'none',
});
```
