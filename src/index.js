import Vue from 'vue'


let vm = new Vue({
    data() {
        return {
            name: {
                first: "Charlie",
                last: "Lau"
            },
            age: 18,
            interests: ['playing', 'reading', {
                a: 'c'
            }]
        }
    }

}).$mount('#app')


// vm.age = 20;
// vm.name.first = "Jerry"

// vm.name.last = "hello"

// vm.$nextTick(()=>{
//     console.log('updated')
// })
// vm.$nextTick(()=>{
//     console.log('updated2')
// })
// let i = 20

// setInterval(() => {
//     vm.age = i++;
// }, 2002)

// setTimeout(()=>{
//     vm.interests.push({c:5},[3])
// },1000)

setTimeout(() => {
    vm.interests.push({
        c: 5
    }, [3])
}, 1000)