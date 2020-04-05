import Vue from 'vue'


const vm = new Vue({
    data() {
        return {
            name:"Jerry",
            msg: 'hello world'
        }
    },
    render(h) {
        return h('div', {
            id: "container"
        }, h('span', {
            style:{
                color: 'red',
                paddingRight:'10px'
            }
        }, this.name,),this.msg)
    }
}).$mount("#app")




setTimeout(()=>{
    vm.name='Charlie'
},1000)


