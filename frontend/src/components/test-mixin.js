const methodMixin = {
    data() {
        return {
        }
    },
    methods:{
        mouseover(node) {
            console.log('mouseover')
            node.selected = true
        },
        mouseout(node) {
            node.selected = false
        },
    }
}
export default methodMixin;