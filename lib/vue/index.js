import {
    initState
} from './observe'
import {
    Watcher,
    nextTick
} from './observe/watch'
import {
    parsePath
} from './util'


export default function Vue(opts) {
    this.$options = opts
    this.init()

}

Vue.prototype.init = function () {
    initState(this)
}

const reg = /\{\{((?:.|\r?\n)+?)(\s?)+\}\}/g

function compiler(vm, node) {
    let nodes = node.childNodes;
    [...nodes].forEach(item => {
        if (item.nodeType === 3) { // text节点
            if (!item.template) {
                item.template = item.textContent;
            }
            item.textContent = item.template.replace(reg, (...args) => {
                const key = args[1]
                const result = parsePath(vm, key)
                return JSON.stringify(result)
            })
        } else {
            compiler(vm, item)
        }
    })

}


Vue.prototype._update = function () {
    const el = this.$el;
    const fragment = document.createDocumentFragment()
    let firstElem
    while (firstElem = el.firstChild) {
        fragment.appendChild(firstElem)
    }
    compiler(this, fragment)
    el.appendChild(fragment)
}

Vue.prototype.$nextTick = function (cb) {
    nextTick(cb)
}

Vue.prototype.$mount = function ($dom) {
    const el = document.querySelector($dom)
    this.$el = el;
    const updateComponent = () => {
        this._update()
    }

    new Watcher(this, updateComponent)
    return this;
}

Vue.prototype.$watch = function (expr, handler, opts) {
   return new Watcher(this, expr, handler, opts)
}