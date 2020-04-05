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
            }],
            school: "lan shan "
        }
    },
    watch: {
        age(newVal, oldVal) {
            console.log(newVal, oldVal)
        },
        "name.first": {
            handler() {
                console.log('updated')
            },
            immediate: true
        }
    },
    computed: {
        fullName() {
            return this.name.first + this.name.last
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

// setTimeout(() => {
//     vm.interests.push({
//         c: 5
//     }, [3])
// }, 1000)


setTimeout(()=>{
    vm.name.first = "Jerry"
},1000)

setTimeout(()=>{
    vm.name.first = "Jerry1"
},2000)