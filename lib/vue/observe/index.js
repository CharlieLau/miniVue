import {
    Observable
} from './observable'
import { Dep } from './dep'

export function initState(vm) {
    if (vm.$options.data) {
        initData(vm)
    }
    if (vm.$options.watch) {
        initWatch(vm, vm.$options.watch)
    }

    if (vm.$options.computed) {
        initComputed(vm, vm.$options.computed)
    }

}


export function observe(data) {

    if (typeof data !== 'object' || data === null) {
        return
    }
    if (data.__ob__) {
        return data;
    }

    return new Observable(data)
}

function proxy(vm, origin, key) {

    Object.defineProperty(vm, key, {
        get() {
            return vm[origin][key]
        },
        set(newVal) {
            vm[origin][key] = newVal
        }
    })

}

function initData(vm) {
    const data = vm.$data = typeof vm.$options.data === 'function' ? vm.$options.data.call(vm) : vm.$options.data

    for (let key in data) {
        proxy(vm, '$data', key)
    }

    observe(data)

}


function initWatch(vm, watches) {
    Object.keys(watches).forEach(exp => {
        let opts = {
            user: true
        }
        let handler = watches[exp]
        if (watches[exp].handler) {
            handler = watches[exp].handler
            opts = {
                ...opts,
                immediate: watches[exp].immediate
            }
        }
        vm.$watch(exp, handler, opts)
    })
}


function createComputedGetter(vm, key) {
    const watch = vm.$watchComputed[key]
    return () => {
        if(watch.dirty){
            watch.evaluate()
        }
        if(Dep.target){ 
          //如果渲染watcher存在
          // 让 当前watcher的依赖重新订阅渲染watcher 触发组件更新
           watch.depend()
        }
        return watch.value
    }
}

function initComputed(vm, computed) {
    vm.$watchComputed = Object.create(null)
    for (let key in computed) {
       
        vm.$watchComputed[key] = vm.$watch(computed[key], () => {}, {
            lazy: true
        })

        Object.defineProperty(vm, key, {
            get: createComputedGetter(vm, key)
        })
    }
}