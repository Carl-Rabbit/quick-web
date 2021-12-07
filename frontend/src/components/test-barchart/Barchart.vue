<template>
    <svg>
        <rect v-for="(bar, index) in renderBars" :key="index" :fill="getFill(bar.node)" stroke="white"
              :width="barWidth" :height="yScale(bar.degree)" :x="xScale(index)" :y="getY(bar)"
              @mouseover="mouseover(bar.node)"
              @mouseout="mouseout(bar.node)"
        >
            <title>{{bar.node.id + '  ' + bar.degree}}</title>
        </rect>
        <g>
            <text v-for="(bar, index) in renderBars" :key="index"
                  style="font-size: 10px"
                  :x="xScale(index) - 1"
                  :y="getY(bar) - 3">{{bar.degree}}</text>
        </g>
        <g v-for="(bar, index) in renderBars" :key="bar.node.id"
           :transform="'translate(' + [xScale(index), containerHeight - bottomMargin + 10] + ')'"
        >
            <text style="font-size: 6px" transform="rotate(90)"
            >{{ bar.node.id }}
            </text>
        </g>
    </svg>
</template>

<script>
import * as d3 from "d3";

export default {
    props: ['nodes', 'links', 'fill','sortBy', 'renderBars'],
    name: "barchart",
    data() {
        return {
            xScale: d3.scaleLinear(),
            yScale: d3.scaleLinear(),
            leftMargin: 20,
            rightMargin: 20,
            topMargin: 50,
            bottomMargin: 80,
            barWidth: 0,
            containerHeight: 0
        }
    },
    mounted() {
        this.xScale.domain([0, this.renderBars.length]).range([this.leftMargin, this.$el.clientWidth - this.rightMargin])
        this.yScale.domain([0, d3.max(this.renderBars, bar => bar.degree)]).range([0, this.$el.clientHeight - this.topMargin - this.bottomMargin])
        this.barWidth = (this.$el.clientWidth - this.leftMargin - this.rightMargin) / this.renderBars.length
        this.containerHeight = this.$el.clientHeight;
    },
    watch:{
        sortBy(newVal){
            console.log('new value', newVal)
        }
    },
    methods: {
        getY(bar) {
            if (this.containerHeight - this.yScale(bar.degree))
                return this.containerHeight - this.yScale(bar.degree) - this.bottomMargin
            else
                return 0
        },
        getHeight(bar) {
            if (bar.degree!= undefined)
                return this.yScale(bar.degree)
            else
                return 0

        },
        getFill(node){
            return node.selected? 'red' : this.fill
        },
        mouseover(node){
            node.selected = true
        },
        mouseout(node){
            node.selected = false
        },
    }
}
</script>

<style scoped>

</style>