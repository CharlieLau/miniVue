import {
    observe
} from './index'

export const arrayProto = Object.create(Array.prototype);


export function observeArrayItem(data) {
    for (let i = 0; i < data.length; i++) {
        observe(data[i])
    }
}

export function dependArrayItem(data) {

    for (let i = 0; i < data.length; i++) {
        
        data[i].__ob__&&data[i].__ob__.dep.depend()

    }
}


['push',
    'pop',
    'unshift',
    'shift',
    'splice'
].forEach(method => {

    arrayProto[method] = function (...args) {

        const result = Array.prototype[method].apply(this, args)
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice':
                inserted = args.slice(2)
                break;

        }

        observeArrayItem(inserted)
        // console.log('设置数组')
        this.__ob__.dep.notify()
        return result
    }


})