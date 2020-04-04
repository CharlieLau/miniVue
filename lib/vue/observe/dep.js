let id = 0;
export class Dep {
    constructor() {
        this.id = id++
        this.subs = []
    }
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }
    addSub(watcher) {
        if (!this.subs.includes(watcher)) {
            this.subs.push(watcher)
        }
    }
}


const stack = []
export function pushTarget(watcher) {
    stack.push(watcher)
    Dep.target = watcher
}


export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}