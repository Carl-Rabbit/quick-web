<template>
    <div class="hello" style="height: 900px;">
        <el-row style="height: 55%">
            <el-col :span="3" style="height: 100%; text-align: left" class="boundary" >
                <el-form ref="form" label-width="80px">
                    <el-form-item label="Radius">
                        <el-input-number size="mini" :min="3" v-model="radius"></el-input-number>
                    </el-form-item>

                    <el-form-item label="Fill">
                        <el-color-picker size="mini" v-model="defaultNodeFill"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="Stroke">
                        <el-color-picker size="mini" v-model="defaultLinkStroke"></el-color-picker>
                    </el-form-item>

                    <el-form-item label="Sort">
                        <el-select size="mini" v-model="sortBy" placeholder="Sort methods">
                            <el-option size="mini" label="Degree" value="degree"></el-option>
                            <el-option size="mini" label="Name" value="name"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button size="mini" type="primary" @click="runSim">Restart</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="7" style="height: 100%" class="boundary">
                <test-nodelink
                        :nodes="nodes" :links="links"
                        style="width: 100%; height: 100%"
                        :r="radius"
                        :fill="defaultNodeFill"
                        :linkStroke="defaultLinkStroke"
                        :counter="counter">
                </test-nodelink>
            </el-col>
            <el-col :span="7" style="height: 100%" class="boundary">
                <test-matrix
                        :nodes="renderNodes" :links="links"
                        style="width: 100%; height: 100%"
                        :fill="defaultNodeFill"
                        :linkStroke="defaultLinkStroke"
                        :counter="counter">
                </test-matrix>
            </el-col>
            <el-col :span="7" style="height: 100%" class="boundary">
                <Barchart style="width: 100%; height: 100%"
                          :renderBars="renderNodes"
                          :nodes="nodes" :links="links"
                          :fill="defaultNodeFill"
                          :sortBy="sortBy"
                ></Barchart>
            </el-col>
        </el-row>

    </div>
</template>

<script>
import TestNodelink from "@/components/test-nodelink-scale/test-nodelink";
import TestMatrix from "@/components/test-matrix/test-matrix"
import Barchart from "@/components/test-barchart/Barchart";
import * as d3 from "d3";
import pipeService from "@/service/pipeService";

export default {
    name: 'TestComponent',
    props: ['counter', 'nodes', 'links'],
    components: {Barchart, TestNodelink, TestMatrix},
    data(){
        return {
            radius: 5,
            defaultNodeFill: '#4682B4',
            defaultLinkStroke: '#F45713',
            sortBy:'default'
        }
    },
    methods: {
        runSim(){
            pipeService.emitRunSimulation('simulation')
        }
    },
    computed:{
        renderNodes() {
            let idCount = {}
            this.links.forEach(link => {
                let sourceId = typeof link.source === 'object' ? link.source.id : link.source
                let targetId = typeof link.target === 'object' ? link.target.id : link.target
                if (idCount[sourceId] === undefined) {
                    idCount[sourceId] = 0
                }
                if (idCount[targetId] === undefined) {
                    idCount[targetId] = 0
                }
                idCount[sourceId] += 1
                idCount[targetId] += 1
            })
            let array = d3.map(this.nodes, (node) => ({id: node.id, node: node, degree: idCount[node.id]}))
            if(this.sortBy === 'degree'){
                array.sort((x, y)=>{
                    return -1 * (x.degree - y.degree)
                })
            }
            return array
        }
    }

}
</script>

<style scoped>

</style>
