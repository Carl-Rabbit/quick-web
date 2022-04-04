<template>
    <svg>
        <g id="container">
            <rect fill="white" width="10000" height="10000"></rect>
            <VueLink v-for="(link, i) in links" :key=i
                     :link="link"
                     :stroke="linkStroke" stroke-width="0.5"
                     :xScale="xScale" :yScale="yScale"
            ></VueLink>
            <VueCircle
                    v-for="(node) in nodes" :key="node.id"  :node="node"
                    :fill="fill"
                    :radius="r"
                    :xScale="xScale"
                    :yScale="yScale"
                    @mouseover.native="mouseover(node)"
                    @mouseout.native="mouseout(node)"
            ></VueCircle>
        </g>
    </svg>
</template>

<script>
import * as d3 from "d3";
import pipeService from "@/service/pipeService";
import methodMixin from "@/components/test-mixin";
import VueCircle from "@/components/test-nodelink-scale/VueCircle";
import VueLink from "@/components/test-nodelink-scale/VueLink";

export default {
    components: {VueCircle, VueLink},
    props: ['counter', 'nodes', 'links', 'r', 'fill', 'linkStroke'],
    name: "test-nodelink",
    mixins: [methodMixin],
    data() {
        return {
            simHandler: undefined,
            xScale: d3.scaleLinear(),
            yScale: d3.scaleLinear(),
            rxScale: d3.scaleLinear(),
            ryScale: d3.scaleLinear(),
        }
    },
    mounted() {
        const _this = this
        this.updateLayout()
        pipeService.onRunSimulation((msg) => {
            console.log('msg', msg)
            this.simHandler.alpha(1).restart()
        })

        // Example: 在vue中使用D3, 也可以使用VUE自带的drag动作
        d3.select(this.$el).selectAll('circle').each(function (d, index) {
            d3.select(this).call(
                drag(_this.simHandler, _this.nodes[index])
            )
        })

        function drag(simulation, d) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
            }

            function dragged(event) {
                d.x = event.x
                d.y = event.y
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

        this.svg = d3.select(this.$el);
        let zoom = d3.zoom()
            .scaleExtent([0, 5])
            .on('zoom',  (event)=>{
                // this.xScale = event.transform.rescaleX(this.rxScale)
                // this.yScale = event.transform.rescaleY(this.ryScale)

                this.svg.select('#container').attr('transform', event.transform);
            });
        this.svg.call(zoom);


    },
    methods: {
        updateLayout() {
            let nodes = this.nodes;
            let links = this.links;
            this.simHandler = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.id))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(this.$el.clientWidth / 2, this.$el.clientHeight / 2))
            console.log('nodes', nodes)
        },
        getFill(node) {
            return node.selected ? 'red' : this.fill
        },
        radius(node) {
            return node.selected ? this.r * 1.5 : this.r
        }
    }

}
</script>

<style scoped>

</style>