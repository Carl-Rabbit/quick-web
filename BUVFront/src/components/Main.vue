<template>
    <div class="hello" style="height: 100%;">
        <el-row :gutter="10" style="height: 100%;" >
            <el-col :span="6" style="height: 100%; ">
                <el-row style="height: 30%;" class="boundary">
                    <div class="mini_head">
                        <div class="mini_title">Dataset</div>
                    </div>
                </el-row>
                <el-row style="height: 70%;" class="boundary">
                    <div class="mini_head">
                        <div class="mini_title">Route List</div>
                    </div>
                    <RouteTable :alldata="alldata" style="height: calc(100% - 20px); width: 100%"></RouteTable>
                </el-row>
            </el-col>
            <el-col :span="18" style="height: 100%;">
                <el-row style="height: 60%;">
                    <el-col :span="14" style="height: 100%;" class="boundary">
                        <div class="mini_head">
                            <div class="mini_title">Map View</div>
                        </div>
                        <MapView style="height: calc(100% - 20px); width: 100%"
                                 v-if="station && alldata"
                                 :station="station"
                                 :selectedRoute="selectedRoute"
                                 :currentTime="currentTime"
                                 :alldata="alldata"></MapView>
                    </el-col>
                    <el-col :span="10" style="height: 100%;" class="boundary" >
                        <div class="mini_head">
                            <div class="mini_title">Route View</div>
                        </div>
                        <RouteView style="height: calc(100% - 20px); width: 100%"
                                   v-if="route && alldata"
                                   :route="route"
                                   :selectedRoute="selectedRoute"
                                   :alldata="alldata">
                        </RouteView>
                    </el-col>
                </el-row>
                <el-row style="height: 40%;" class="boundary">
                    <el-col :span="24" style="height: 100%;" >
                        <div class="mini_head">
                            <div class="mini_title">Temporal View</div>
                        </div>
                        <TemporalView style="height: calc(100% - 20px); width: 100%"
                                      v-if="station && alldata"
                                      :contourList="contourList"
                        ></TemporalView>
                    </el-col>

                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>

import RouteTable from "@/components/RouteTable";
import MapView from "@/components/MapComponent/MapView";
import RouteView from "@/components/RouteView";
import TemporalView from "@/components/TemporalView";
export default {
    name: 'MainComponent',
    props: ["route", "station", "alldata", "selectedRoute", "contourList", "currentTime"],
    components: {TemporalView, RouteView, RouteTable, MapView},
    data(){
        return {
            radius: 5,
            defaultNodeFill: '#4682B4',
            defaultLinkStroke: '#F45713',
            sortBy:'default'
        }
    },
    mounted(){}

}
</script>

<style scoped>

</style>
