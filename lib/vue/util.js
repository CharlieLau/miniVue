export function parsePath(vm, expr) {
    const keys = expr.split(/\.|\[|\]/).filter(item => item)
    return keys.reduce((prev, nxt) => {
        let memo = prev[nxt]
        return memo
    }, vm)
}