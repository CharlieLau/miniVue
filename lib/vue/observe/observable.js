import {
    observe
} from './index'
import {
    observeArrayItem,
    dependArrayItem,
    arrayProto
} from './array'
import {
    Dep
} from './dep'

export function defineReactive(data, key, val) {
    let childObserver = observe(val)
    const dep = new Dep()
    Object.defineProperty(data, key, {
        get() {
            if (Dep.target) {
                dep.depend()
            }
            if (childObserver) {
                childObserver.dep.depend()
                dependArrayItem(data)
            }

            return val
        },
        set(newVal) {
            if (val !== newVal) {
                // 如果设置的还是对象
                observe(newVal)
                val = newVal
                dep.notify()
            }
        }
    })

}

export class Observable {
    constructor(data) {
        this.dep = new Dep()
        Object.defineProperty(data, '__ob__', {
            get: () => this
        })

        if (Array.isArray(data)) {
            data.__proto__ = arrayProto;
            observeArrayItem(data)
        } else {
            this.walk(data)
        }
    }

    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}