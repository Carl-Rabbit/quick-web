<template>
    <svg>
        <line v-for="(link, i) in links" :key=i
              :x1="link.source.x" :y1="link.source.y"
              :x2="link.target.x" :y2="link.target.y"
              :stroke="linkStroke" stroke-width="0.5"
        ></line>
        <circle
                v-for="(node) in nodes" :key="node.id" :fill="getFill(node)"
                :r="node.selected? r * 1.5 : r" :cx="node.x" :cy="node.y"
                @mouseover="mouseover(node)"
                @mouseout="mouseout(node)"
        ></circle>
        <g>
            <text v-for="(node) in nodes" :key="node.id" :x="node.x" :y="node.y"
                  style="font-size: 10px; pointer-events:none"
            >{{ node.id }}
            </text>
        </g>
    </svg>
</template>

<script>
import * as d3 from "d3";
import pipeService from "@/service/pipeService";

export default {
    props: ['counter', 'nodes', 'links', 'r', 'fill', 'linkStroke'],
    name: "test-nodelink",
    data() {
        return {
            simHandler: undefined
        }
    },
    mounted() {
        const _this = this
        this.updateLayout()
        pipeService.onRunSimulation(() => {
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
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                d.x = event.x
                d.y = event.y
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }
    },
    methods: {
        updateLayout() {
            let nodes = this.nodes;
            let links = this.links;
            this.simHandler = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.id))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(this.$el.clientWidth / 2, this.$el.clientHeight / 2))
        },
        mouseover(node) {
            node.selected = true
        },
        mouseout(node) {
            node.selected = false
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