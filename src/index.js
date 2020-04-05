//<div id="container"><span style="color:red">welcome</span> world</div>


import {
    h,
    render,
    patch
} from 'vue/vdom'


const oldNode =
    h('ul', {
            id: "container"
        },
        h('li', {
            style: {
                background: 'yellow'
            },
            key: 'a'
        }, 'a'),
        h('li', {
            style: {
                background: 'red'
            },
            key: 'b'
        }, 'b'),
        h('li', {
            style: {
                background: 'pink'
            },
            key: 'c'
        }, 'c'),
        h('li', {
            style: {
                background: 'green'
            },
            key: 'd'
        }, 'd'))


render(oldNode, document.querySelector('#app'))


const newNode =
    h('ul', {
            id: "aa"
        },
        h('li', {
            style: {
                background: 'green'
            },
            key: 'd'
        }, 'd'),
        h('li', {
            style: {
                background: 'pink'
            },
            key: 'c'
        }, 'c'),
        h('li', {
            style: {
                background: 'red'
            },
            key: 'b'
        }, 'b'),
        h('li', {
            style: {
                background: 'yellow'
            },
            key: 'a'
        }, 'a')
    )


setTimeout(() => {
    patch(newNode, oldNode)
}, 2000)