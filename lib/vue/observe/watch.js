import {
    pushTarget,
    popTarget
} from './dep'
import {
    parsePath
} from '../util'

let id = 0;
export class Watcher {

    constructor(vm, expOrFn, cb, opts = {}) {
        this.expOrFn = expOrFn
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else if (opts.user === true) {
            this.getter = () => parsePath(vm, expOrFn)
        }
        this.cb = cb;
        this.opts = opts

        this.lazy = this.dirty = opts.lazy
        this.vm = vm;
        this.id = id++;
        this.deps = []
        this.depIds = new Set()
        this.value = this.lazy ? undefined : this.get()
        if (opts && opts.immediate) {
            this.cb.call(vm, this.value)
        }
    }

    addDep(dep) {
        if (!this.depIds.has(dep.id)) {
            this.deps.push(dep)
            this.depIds.add(dep.id)
            dep.addSub(this)
        }
    }

    get() {
        pushTarget(this)
        let value = this.getter.call(this.vm)
        popTarget()
        return value
    }

    update() {
        if (this.lazy) { // 
            this.dirty = true  //  computed watcher 依赖的其他属性发生变化了 取值的时候 需要重新求值
        } else {
            queueWatcher(this)
        }
    }

    evaluate() {
        this.value = this.get()
        this.dirty = false
    }

    depend() {
        this.deps.forEach(dep => dep.depend())
    }

    run() {
        let oldValue = this.value;
        let value = this.get()
        this.value = value

        if (this.opts && this.opts.user) {
            this.cb.call(this.vm, this.value, oldValue)
        }
    }
}


let watchers = []
let watcherIds = {}

let callbacks = []

function flushWatcher() {
    watchers.forEach(watcher => watcher.run())
    watcherIds = {}
    watchers = []
}

export function nextTick(cb) {
    callbacks.push(cb)

    const tiemFun = () => {
        flushCallbacks()
    }
    if (Promise) {
        Promise.resolve().then(tiemFun)
    } else if (MutationObserver) {
        const observer = new MutationObserver(tiemFun)
        let textnode = document.createTextNode(1)
        observer.observe(textnode, {
            characterData: true
        })
        textnode.textContent = 2;
    } else if (setImmediate) {
        setImmediate(tiemFun)
    } else {
        setTimeout(tiemFun, 0)
    }
}

function flushCallbacks() {
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
        copies[i]()
    }
}



function queueWatcher(watcher) {
    if (!watcherIds[watcher.id]) {
        watchers.push(watcher)
        watcherIds[watcher.id] = true
    }

    nextTick(flushWatcher)
}