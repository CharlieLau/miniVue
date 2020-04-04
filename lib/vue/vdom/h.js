import {
    vnode
} from './create-element'

export function h(tag, props, ...children) {
    let key = props.key
    delete props.key
    children = children.map(item => {
        if (typeof item === 'string') {
            return vnode(undefined, undefined, undefined, undefined, item)
        }
        return item;
    })

    return vnode(tag, props, key, children)
}