const methodMixin = {
    data() {
        return {
        }
    },
    methods:{
        mouseover(node) {
            node.selected = true
        },
        mouseout(node) {
            node.selected = false
        },
    }
}
export default methodMixin;