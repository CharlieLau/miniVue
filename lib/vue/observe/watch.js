import {
    pushTarget,
    popTarget
} from './dep'

let id = 0;
export class Watcher {

    constructor(vm, expOrFn, cb, opts) {
        this.expOrFn = expOrFn
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        }
        this.cb = cb;
        this.opts = opts
        this.vm = vm;
        this.id = id++;
        this.deps = []
        this.depIds = new Set()
        this.get()
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
        this.getter()
        popTarget()
    }

    update() {
        queueWatcher(this)
    }

    run() {
        this.get()
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
        watcherIds[watcher.id] = 1
    }
    nextTick(flushWatcher)
}