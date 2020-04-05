export function render(vnode, container) {
    const el = createElement(vnode, container)
    return container.appendChild(el)
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
    const newProps = vnode.props || {}

    // 2. 新属性更新老属性
    // 2.1  比对属性 如果老的存在 新的不存在 删除掉样式
    let oldStyle = oldProps.style
    let newStyle = newProps.style;

    for (let key in oldStyle) {
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


export function patch(newVnode, oldVnode) {
    // 1. 如果新父节点tag 不同于 old父节点tag 直接替换
    if (newVnode.tag !== oldVnode.tag) {
        oldVnode.el.parentNode.replaceChild(createElement(newVnode), oldVnode.el)
    }
    // 2. 相等的情况 比较标签
    if (!oldVnode.tag) {
        if (oldVnode.text !== newVnode.text) {
            oldVnode.el.textContent = newVnode.text;
        }
    }
    // 3. 不是文本，标签一样 可能属性不一样
    let el = newVnode.el = oldVnode.el
    updateProperties(newVnode, oldVnode.props)

    // 4. 比较孩子

    let newChildren = newVnode.children || []
    let oldChildren = oldVnode.children || []


    if (newChildren.length && oldChildren.length) {
        //  4.1 老的有孩子 新的也有孩子
        updateChildren(el, newChildren, oldChildren)
    } else if (oldChildren.length) {
        // 4.2 老的有孩子  新的没孩子
        el.innerHTML = ''

    } else if (newChildren.length) {
        // 4.3  老的没孩子 新的有孩子
        newChildren.forEach(child => {
            el.appendChild(createElement(child))
        })
    }
    return el;
}

function isSameVnode(newVnode, oldVnode) {

    return newVnode.tag === oldVnode.tag &&
        newVnode.key === oldVnode.key
}

function updateChildren(parentNode, newChildren, oldChildren) {
    // 双向指针
    let oldFirstIndex = 0;
    let oldFirstVnode = oldChildren[0]
    let oldLastIndex = oldChildren.length - 1;
    let oldLastVnode = oldChildren[oldLastIndex];

    let newFirstIndex = 0;
    let newFirstVnode = newChildren[0]
    let newLastIndex = newChildren.length - 1;
    let newLastVnode = newChildren[newLastIndex];

    function makeIndexByKey(children) {
        const map = {}
        children.forEach((child, index) => {
            map[child.key] = index
        })
        return map
    }

    const map = makeIndexByKey(oldChildren)
    // 双指针从前到后 
    while (oldFirstIndex <= oldLastIndex && newFirstIndex <= newLastIndex) { //双指针移动
        if (!oldFirstVnode) {
            oldFirstIndex = oldChildren[++oldFirstIndex];
        } else if (!oldLastVnode) {
            oldLastVnode = oldChildren[--oldLastIndex];
        }
        if (isSameVnode(newFirstVnode, oldFirstVnode)) { // 如果 头相等 从头开始比较
            // abcd  abcde
            patch(newFirstVnode, oldFirstVnode) // 更新属性
            oldFirstVnode = oldChildren[++oldFirstIndex]
            newFirstVnode = newChildren[++newFirstIndex]
        } else if (isSameVnode(newLastVnode, oldLastVnode)) { // 如果 尾相等 从尾部开始比较
            //  abcd   eabcd
            patch(newLastVnode, oldLastVnode)
            oldLastVnode = oldChildren[--oldLastIndex]
            newLastVnode = newChildren[--newLastIndex]
        } else if (isSameVnode(newLastIndex, oldFirstVnode)) {
            // 倒序  从后面比较一下 abcd  dcba
            patch(newLastIndex, oldFirstVnode)
            parentNode.insertBefore(oldFirstVnode.el, oldLastVnode.el.nextSibling)
            oldFirstVnode = oldChildren[++oldFirstIndex]
            newLastVnode = newChildren[--newLastIndex]
        } else if (isSameVnode(newFirstVnode, oldLastVnode)) { // 后面
            //插入   abcd   dabc
            patch(newFirstVnode, oldLastVnode)
            parentNode.insertBefore(oldLastVnode.el, oldFirstVnode.el)
            newFirstVnode = newChildren[++newFirstIndex]
            oldLastVnode = oldChildren[--oldLastIndex]
        } else { // 乱序 不复用
            // 先拿新节点第一项去老节点中匹配，如果匹配不到插入到老节点前面
            // 如果能查到 直接移动老节点
            // 老节点有剩余 删除就行

            let moveIndex = map[newFirstVnode.key]
            if (moveIndex === undefined) { // 找不到插入
                parentNode.insertBefore(createElement(newFirstVnode), oldFirstVnode.el)
            } else { //  找到移动
                let moveVnode = oldChildren[moveIndex];
                patch(newFirstVnode, moveVnode)
                oldChildren[moveIndex] = undefined // 占位 防止坍塌
                parent.insertBefore(moveVnode.el, oldFirstVnode.el)
            }
            newFirstVnode = newChildren[++newFirstIndex]
        }
    }

    // 最后插入
    if (newFirstIndex <= newLastIndex) { // 当新节点有富余, 增加富余节点
        for (let i = newFirstIndex; i <= newLastIndex; i++) {
            // parentNode.appendChild(createElement(newChildren[i]))
            //  有可能往前插入 也有可能往后插入  
            //  所以想到API insertBefore()   注意：第二个参数为null 代表appendChild
            let ele = newChildren[newLastIndex + 1] === null ? null : newChildren[newLastIndex + 1].el
            parentNode.insertBefore(createElement(newChildren[i]), ele)
        }
    }

    // 最后 删除 
    if (oldFirstIndex <= oldLastIndex) {
        for (let i = oldFirstIndex; i <= oldLastIndex; i++) {
            let child = oldChildren[i]
            if (child !== undefined) { // 删除undefined之后的节点
                parentNode.removeChild(child.el)
            }
        }
    }
}