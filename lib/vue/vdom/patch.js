export function render(vnode, container) {
    const el = createElement(vnode, container)
    container.appendChild(el)
}

function createElement(vnode, container) {
    if (vnode.tag) {
        vnode.el = document.createElement(vnode.tag)
        updateProperties(vnode)
        if (vnode.children) {
            vnode.children.forEach(child => {
                render(child, vnode.el)
            })
        }
    } else {
        vnode.el = document.createTextNode(vnode.text)
    }
    return vnode.el
}


function updateProperties(vnode, oldProps = {}) {
    const newProps = vnode.props

    // 2. 新属性更新老属性
    // 2.1  比对属性 如果老的存在 新的不存在 删除掉样式
    let oldStyle = oldProps.style
    let newStyle = newProps.style;
    for (let key in oldProps) {
        if (!newStyle[key]) {
            vnode.el.style[key] = ''
        }
    }


    // 2.1 新属性如果不存在老的props 删掉属性
    for (let key in oldProps) {
        if (!newProps[key]) {
            delete vnode.el[key]
        }
    }


    // 1. 考虑 old props不存在的情况
    for (let key in newProps) {
        if (key === 'style') {
            Object.keys(newProps.style).forEach(skey => {
                vnode.el.style[skey] = newProps.style[skey]
            })
        } else if (key === 'class') {
            vnode.el.className = newProps[key]
        } else {
            vnode.el[key] = newProps[key]
        }
    }

}