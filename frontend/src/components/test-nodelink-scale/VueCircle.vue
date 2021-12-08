<template>
    <g :transform="transform">
        <circle  :fill="fillColor"
                 :r="node.selected? radius* 1.5 :radius" :stroke="'white'"
        ></circle>
        <g>
            <text style="font-size: 10px; pointer-events:none">
                {{ node.id }}
            </text>
        </g>
    </g>
</template>

<script>
export default {
    name: "VueCircle",
    props: ['node', 'xScale', 'yScale', 'fill', 'radius'],
    computed:{
        x(){
            return this.xScale(this.node.x)
        },
        y(){
            return this.yScale(this.node.y)
        },
        transform(){
            return "translate(" + [this.x, this.y] + ")"
        },
        fillColor(){
            return this.node.selected ? 'red' : this.fill
        },
        selected(){
            return this.node.selected;
        }
    },
    watch:{
        selected(newVal, oldVal){
            console.log('watched', newVal, oldVal)
        }
    }
}
</script>

<style scoped>

</style>