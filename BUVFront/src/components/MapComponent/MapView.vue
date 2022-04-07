<template>
    <div >
        <el-row class="mini_head" style="position: relative">
            <el-col :span="4">
                <div class="mini_title">Map View</div>
            </el-col>

            <el-col :span="8" >
                <div>&nbsp;</div>
            </el-col>

            <el-col :span="3" style="text-align: left">
                <div style="font-size: 12px; display: table-cell; bottom: 0px">
                    Threshold: &nbsp;&nbsp;{{slideValue}}
                </div>
            </el-col>

            <el-col :span="7">
                <div>
                    <input type="range" min="0" :max="contourSize" value="slideValue" class="slider" id="myRange" v-model="slideValue">
                </div>
            </el-col>
        </el-row>
        <div style="position: relative; width: 100%; height: calc(100% - 20px);">
            <div>{{slideValue}}</div>
            <div
                    id="map"
                    class="map"
                    style="position: absolute; width: 100%; height: calc(100%); z-index: 1; top:0px"
            ></div>
            <svg
                    id="svgContainer"
                    style="position: absolute; left: 0px; top: 0px; z-index: 10000; pointer-events: none;
                            width: 100%; height: 100%; "
            >
                <g class="contour">
                    <g  v-for="(c, i) in contourRender" :key="i">
                        <path stroke-linejoi="round" v-if="i >= slideValue"
                              fill-opacity="0.1" stroke-opacity="0.5" :stroke-width="(i % 5 ? 0.25 : 1)"
                              :d="c.path" :fill="c.fill" :stroke="'black'"
                        ></path>
                    </g>
                </g>
                <g class="route" v-if="selectedRoute">
                    <circle v-for="(c, i) in routeStations" :key="i" r="3"
                            :fill="selectedRoute['type'] == 'up'? '#ff7f0e': '#1f77b4'"
                            fill-opacity="0.5"
                            :stroke="selectedRoute['type'] == 'up'? '#ff7f0e': '#1f77b4'"
                            :cx="c.x" :cy="c.y"></circle>
                    <path v-if="routePath" stroke-width="1" :d="routePath"
                          :stroke="selectedRoute['type'] == 'up'? '#ff7f0e': '#1f77b4'"
                          fill="none"
                    ></path>
                </g>
            </svg>
        </div>
    </div>

</template>


<script>

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as d3 from "d3";


export default {
    name: "MapView",
    props:['station', 'alldata', 'selectedRoute', 'currentTime'],
    data(){
        return {
            slideValue: 0,
            maxLevel: 10,

            map: undefined,

            initBandWidth: 20,
            initDegree: 11,
            canvasWidth: 0,
            canvasHeight: 0,

            // currentTime: "06:00:00",
            flag: 0,
            contourValueMin: -1,
            contourValueMax: -1,
            contour: [],
            contourRender: [],

            routeStations: [],
            routePath: undefined,

        }
    },
    computed: {
        contourSize(){
            return this.contourRender.length;
        },
        contourData(){
            // TODO: Need alldata and currentTime
            const parseTime = d3.timeParse("%H:%M:%S");
            var time_parse = parseTime(this.currentTime);
            let _this = this;
            let outputContour = []
            var arr = new Array(36); //创建二维数组
            for (var k = 0; k < 36; k++) {
                arr[k] = new Array();
            }

            for (var routeID in _this.alldata) {
                for (var global_order in _this.alldata[routeID]) {
                    for (var i in _this.alldata[routeID][global_order]) {
                        var temp = {};
                        var time = _this.alldata[routeID][global_order][i]["time_mean"];
                        temp["lat"] = _this.alldata[routeID][global_order][i]["latitude"];
                        temp["lon"] = _this.alldata[routeID][global_order][i]["longitude"];
                        temp["uncertainty"] =
                            _this.alldata[routeID][global_order][i]["uncertainty"];
                        for (var j = 0; j < 36; j++) {
                            if (21600 + 1800 * j <= time && time < 21600 + 1800 * (j + 1)) {
                                arr[j].push(temp);
                            }
                        }
                    }
                }
            }

            for (var m = 0; m < 36; m++) { //匹配当前时间
                var time_second1 = 21600 + 1800 * m;

                var time_second2 =
                    new Date(time_parse).getHours() * 3600 +
                    new Date(time_parse).getMinutes() * 60;
                if (time_second1 == time_second2) {
                    outputContour = arr[m];
                }
            }

            return outputContour
        }
    },
    mounted(){

        this.canvasWidth = this.$el.clientWidth;
        this.canvasHeight = this.$el.clientHeight;
        this.map = this.createMap()
        this.convertContourLocal()

        this.updateContour()
        this.updateSelectedRoute()

        this.map.on("zoom", ()=>{
            this.updateContour()
            this.updateSelectedRoute()
        });
        this.map.on("dragend", ()=>{
            this.updateContour()
            this.updateSelectedRoute()
        });
    },
    watch:{
        selectedRoute(){
            this.updateSelectedRoute()
        },
        currentTime(){
            this.updateContour()
        }
    },
    methods:{
        convertTime(value) {
            //将data.json数据的time_mean转化成时分秒
            var secondTime = parseInt(value); // 秒
            var minuteTime = 0; // 分
            var hourTime = 0; // 小时
            // var result = "";
            if (value < 60) {
                result = secondTime + "秒";
            } else {
                if (secondTime >= 60) {
                    // 如果秒数大于60，将秒数转换成整数
                    // 获取分钟，除以60取整数，得到整数分钟
                    minuteTime = parseInt(secondTime / 60);
                    // 获取秒数，秒数取佘，得到整数秒数
                    secondTime = parseInt(secondTime % 60);
                    // 如果分钟大于60，将分钟转换成小时
                    if (minuteTime >= 60) {
                        // 获取小时，获取分钟除以60，得到整数小时
                        hourTime = parseInt(minuteTime / 60);
                        // 获取小时后取佘的分，获取分钟除以60取佘的分
                        minuteTime = parseInt(minuteTime % 60);
                    }
                }
                var result = "" + parseInt(secondTime);
                if (minuteTime >= 0) {
                    result = "" + parseInt(minuteTime) + ":" + result;
                }
                if (hourTime >= 0) {
                    result = "" + parseInt(hourTime) + ":" + result;
                }
                return result;
            }
        },
        createMap() {
            let map = L.map("map", {
                center: [22.607822, 114.02734],
                zoom: 11, //缩放比例
                maxZoom: 20,
                minZoom: 10,
                zoomControl: true, //+ - 按钮
                doubleClickZoom: true, //双击放大
                attributionControl: true, // 右下角leaflet标识
            });

            //引入图层,可以引入多个图层
            L.tileLayer(
                "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            ).addTo(map);

            //设置图标样式
            var myIcon = L.icon({
                iconUrl: require("@/assets/bus.png"),
                iconSize: [19, 25],
            });
            //画点
            L.marker([22.531669, 114.11953899999999], { icon: myIcon }).addTo(
                map
            );
            return map
        },
        updateContour(){
            let mymap = this.map;
            let bandWidth =
                this.initBandWidth * 2 ** (mymap.getZoom() - this.initDegree);
            let contours = d3
                .contourDensity()
                .x((d) => mymap.latLngToContainerPoint(L.latLng(d.lat, d.lon)).x)
                .y((d) => mymap.latLngToContainerPoint(L.latLng(d.lat, d.lon)).y)
                .weight((d) => d.uncertainty)
                .size([this.canvasWidth, this.canvasHeight])
                .bandwidth(bandWidth)
                .thresholds(15)(this.contourData);
            this.contour = contours
            this.contourRender = []
            let max_d = d3.max(this.contour, (d) => d.value);
            console.log('this.contour ------- ', this.contour)
            this.contour.forEach(c=>{
                this.contourRender.push({
                    data: c,
                    path: d3.geoPath()(c),
                    fill: d3.interpolateBlues(c.value / max_d)
                })
            })
        },
        updateSelectedRoute(){
            let route = this.selectedRoute
            if(route == undefined){
                return false
            }
            let routeid = route["route_id"] + "/2";
            if (route['type'] == 'up'){
                routeid = route["route_id"] + "/1";
            }

            var rawdata = [];
            let stations = []
            for (var i in this.alldata[routeid]["1"]) {
                var temp = {};
                temp["route_id"] = routeid;
                temp["lat"] = this.alldata[routeid]["1"][i]["latitude"];
                temp["lon"] = this.alldata[routeid]["1"][i]["longitude"];
                temp["station_id"] = this.alldata[routeid]["1"][i]["station_id"];
                rawdata.push(temp);
                let _loc = this.map.latLngToContainerPoint(L.latLng(temp.lat,temp.lon))
                stations.push({data: temp, x: _loc.x, y: _loc.y })
            }
            this.routeStations = stations
            let line = d3.line().x((d)=>d.x).y((d)=>d.y);
            this.routePath = line(stations)
        },
        convertContourLocal() {
            //将contour数据转化为每个时间点对应的contour数据传给temporal
            var mymap = this.map;
            let _this = this;
            let bandWidth =
                _this.initBandWidth * 2 ** (mymap.getZoom() - _this.initDegree);
            //原始经纬度数据按时间分组
            var dict = {};
            var arr = new Array(36); //创建二维数组
            for (var k = 0; k < 36; k++) {
                arr[k] = new Array();
            }

            for (var routeID in this.alldata) {
                for (var global_order in this.alldata[routeID]) {
                    for (var i in this.alldata[routeID][global_order]) {
                        var temp = {};
                        var time = this.alldata[routeID][global_order][i]["time_mean"];
                        temp["lat"] = this.alldata[routeID][global_order][i]["latitude"];
                        temp["lon"] = this.alldata[routeID][global_order][i]["longitude"];
                        temp["uncertainty"] =
                            this.alldata[routeID][global_order][i]["uncertainty"];
                        for (var j = 0; j < 36; j++) {
                            if (21600 + 1800 * j <= time && time < 21600 + 1800 * (j + 1)) {
                                arr[j].push(temp);
                            }
                        }
                    }
                }
            }
            for (var m = 0; m < 36; m++) {
                var time_second = 21600 + 1800 * m;
                var time_f = this.convertTime(time_second);
                dict[time_f] = arr[m];
            }
            // console.log(arr);
            // console.log(dict);
            console.log('dict-=--- ', dict)
            let contourList = []
            for (i in dict) {
                //原始时间分组的数据计算出contour数据
                var contours = d3
                    .contourDensity()
                    .x((d) => mymap.latLngToContainerPoint(L.latLng(d.lat, d.lon)).x)
                    .y((d) => mymap.latLngToContainerPoint(L.latLng(d.lat, d.lon)).y)
                    .weight((d) => d.uncertainty)
                    .size([_this.canvasWidth, _this.canvasHeight])
                    .bandwidth(bandWidth)
                    .thresholds(15)(dict[i]);
                if (dict[i].length > 0) {

                    let data = { time: i, contours: contours,width:_this.canvasWidth,height:_this.canvasHeight }

                    contourList.push(data)
                }
            }

            this.$store.commit('test/setContour', contourList)
        }
    }
}
</script>

<style scoped>
.slider {
    -webkit-appearance: none;
    width: 100%;
    height: 12px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
}
.slider:hover {
    opacity: 1;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: #1f77b4;
    cursor: pointer;
}

.slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #1f77b4;
    cursor: pointer;
}
</style>