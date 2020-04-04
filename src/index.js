//<div id="container"><span style="color:red">welcome</span> world</div>


import {
    h,
    render
} from 'vue/vdom'


const oldNode =
    h('div', {
        id: "container"
    }, h('span', {
        style: {
            color:"red"
        }
    }, 'hello'), 'world')


render(oldNode,document.querySelector('#app'))
