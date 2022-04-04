<template>
    <line
            :x1="x1" :y1="y1"
            :x2="x2" :y2="y2"
    ></line>
</template>

<script>
export default {
    name: "VueCircle",
    props: ['link', 'xScale', 'yScale'],
    computed:{
        x1(){
            return this.xScale(this.link.source.x)
        },
        x2(){
            return this.xScale(this.link.target.x)
        },
        y1(){
            return this.yScale(this.link.source.y)
        },
        y2(){
            return this.yScale(this.link.target.y)
        },
    }
}
</script>

<style scoped>

</style>