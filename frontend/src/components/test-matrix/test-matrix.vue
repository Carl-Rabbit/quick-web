<template>
    <svg>
        <!-- upper label-->
        <g id="container">
            <g>
                <circle v-for="(n, i) in nodes" :key="i" :cx="xScale(i)" :cy="margin - 10"
                        :r="n.node.selected? 3 * 1.5 : 3" stroke="white"
                        :fill="getFill(n)"
                        @mouseover="mouseover(n.node)"
                        @mouseout="mouseout(n.node)"
                ></circle>
            </g>
            <g>
                <g v-for="(n, i) in nodes" :key="i" :transform="'translate(' + [xScale(i), margin-15] + ')'">
                    <text style="font-size: 6px" transform="rotate(-90)">{{ n.id }}</text>
                </g>
            </g>
            <!-- left label -->
            <g>
                <circle v-for="(n, i) in nodes" :key="i" :cx="margin - 10" :cy="yScale(i)"
                        :r="n.node.selected? 3 * 1.5 : 3"
                        :fill="getFill(n)" stroke="white"
                        @mouseover="mouseover(n.node)"
                        @mouseout="mouseout(n.node)"
                ></circle>
            </g>
            <g>
                <g v-for="(n, i) in nodes" :key="i" :transform="'translate(' + [5, yScale(i)] + ')'">
                    <text style="font-size: 6px" transform="rotate(0)">{{ n.id }}</text>
                </g>
            </g>
            <!-- cells -->
            <g>
                <g  v-for="(link, j) in links" :key="j">
                    <cell :link="link"
                          :xScale="xScale" :yScale="yScale" :fill="linkStroke" :id2Index="id2Index"></cell>
                </g>
            </g>
        </g>
    </svg>
</template>

<script>
import * as d3 from "d3";
import Cell from "@/components/test-matrix/cell";
import methodMixin from "@/components/test-mixin";
export default {
    components: {Cell},
    props: ['counter', 'nodes', 'links', 'fill', 'linkStroke'],
    name: "test-nodelink",
    mixins: [methodMixin],
    data() {
        return {
            xScale: d3.scaleLinear(),
            yScale: d3.scaleLinear(),
            margin: 80
        }
    },
    mounted() {
        this.xScale = d3.scaleLinear().domain([0, this.nodes.length]).range([this.margin, this.$el.clientWidth - 10])
        this.yScale = d3.scaleLinear().domain([0, this.nodes.length]).range([this.margin, this.$el.clientHeight - 10])
    },
    computed: {
        id2Index() {
            let idMap = {}
            this.nodes.forEach((node, index) => {
                idMap[node.id] = index
            })
            return idMap
        }
    },
    methods:{
        getFill(node){
            return node.node.selected? 'red' : this.fill
        }
    }
}
</script>

<style scoped>

</style>