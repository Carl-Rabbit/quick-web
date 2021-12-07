<template>
    <div class="main-page" style="height: 100%">
        <TestComponent
                v-if="graph"
                :counter="counter"
                :nodes="nodes"
                :links="links"
        ></TestComponent>
    </div>
</template>

<script>
import TestComponent from "@/components/test-page/TestComponent";
import {mapState} from "vuex";
import * as d3 from "d3";

export default {
    name: 'TestPage',
    components: {
        TestComponent,
    },
    data(){
        return {
            nodes: [],
            links: []
        }
    },
    mounted(){
        this.$store.dispatch('test/fetchData');

    },
    computed: {
        ...mapState('test', {
            graph: state => state.graph,
            counter: state => state.counter,
        }),
    },
    watch:{
        graph(newVal){
            if(newVal){
                this.nodes = d3.map(newVal.nodes, (_) => ({id: _.id, x: 0, y:0, selected: false}));
                this.links = d3.map(newVal.links, (_) => ({source: _.source, target: _.target, x:0, y:0, selected: false}))
            }
        }
    }
}
</script>

<style>
.boundary {
    /*border-style: dashed;*/
    border-style: solid;
    border-color: #d3dce6;
    border-width: 0.5px;
    border-radius: 3px;
}

</style>
