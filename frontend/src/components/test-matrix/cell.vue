<template>
    <g>
        <g  :transform=transform>
            <circle :fill="fill" r="2"></circle>
        </g>
        <g  :transform=transformLeft>
            <circle :fill="fill" r="2"></circle>
        </g>
    </g>
</template>

<script>
export default {
    props: ['link', 'xScale', 'yScale', 'id2Index', 'fill'],
    name: "cell",
    computed:{
        transform(){
            if(this.id2Index[this.link.source.id] && this.id2Index[this.link.target.id] ){
                return 'translate(' + [this.xScale(this.id2Index[this.link.source.id]),
                    this.yScale(this.id2Index[this.link.target.id])] + ')'
            }else{
                return 'translate(' + [0, 0] + ')'
            }

        },
        transformLeft(){
            if(this.id2Index[this.link.source.id] && this.id2Index[this.link.target.id] ){
                return 'translate(' + [this.xScale(this.id2Index[this.link.target.id]),
                    this.yScale(this.id2Index[this.link.source.id])] + ')'
            }else{
                return 'translate(' + [0, 0] + ')'
            }
        }
    }
}
</script>

<style scoped>

</style>