<template>
    <div style="height: 100%; width: 100%">
        <svg style="height: 100%; width: 100%">
            <g class="container" :transform="containerTransform">
                <g class="centerContainer">
                    <rect :width="containerWidth" :height="containerHeight" fill="grey" fill-opacity="0.1"></rect>
                    <g class="timeContainer" v-for="(t,i) in contiContourCenter" :key="i">
                        <circle v-for="(c, j) in t.points" :key="j" r = 3 fill="#1f77b4" :cx="c.x" :cy="c.y"></circle>
                    </g>
                    <g class='pathContainer'>
                        <path v-for="(p, i) in centerConnection" :key="i" :d="p.path"
                              fill="none" stroke="#1f77b4" stroke-width="0.5"
                        ></path>
                    </g>
                </g>
            </g>

        </svg>
    </div>
</template>

<script>
import * as d3 from "d3";

import {calIOU} from "@/service/module/dataService";

export default {
    name: "TemporalView",
    props:['contourList'],
    data(){
        return {
            alldata_iou: {}, //判断相交数据的全局变量,

            // canvas layout
            top: 20,
            left: 30,
            right: 20,
            bottom: 25,

            containerWidth: 0,
            containerHeight: 0,
            centers: [],

            timeCenterContainer: [],
            centerConnection: []
        }
    },
    computed:{
        containerTransform(){
            return "translate(" + [this.left, this.top] + ')'
        },
        mapCanvasWidth(){
            // TODO
            if(this.contourList && this.contourList.length != 0){
                return this.contourList[0].width
            }
            return -1
        },
        mapCanvasHeight(){
            // TODO
            if(this.contourList && this.contourList.length != 0){
                return this.contourList[0].height
            }
            return -1
        },
        contiContourCenter(){
            if(this.contourList){
                return this.getContiContourCenter(this.contourList);
            }
            return []
        }
    },
    mounted() {
        this.containerWidth = this.$el.clientWidth - this.left - this.right
        this.containerHeight = this.$el.clientHeight - this.bottom - this.top
        this.initView();
    },
    watch:{
        contourList(){
            this.calculate_iou(this.contourList, this.alldata_iou)
        }
    },
    methods:{
        setCurrentTime(currentTime){
            this.$store.commit('test/setCurrentTime', currentTime)
        },
        initView() {
            //画temproal view的坐标系
            console.log('this.width   ', this.width, this.height)
            let width = this.containerWidth
            let height = this.containerHeight
            var padding = { left: 0, top: 0, right: 0, bottom: 0 };

            let svg = d3.select(this.$el).select('svg')
            let g = svg.select('.container')
            // g.selectAll('*').remove()

            //将数据的时间转化成d3能识别的时间
            const parseTime = d3.timeParse("%H:%M:%S");
            //创建比例尺

            this.xScale = d3.scaleTime()
                .domain([parseTime("06:00:00"), parseTime("24:00:00")]).range([0, width - padding.left - padding.right]);
            this.yScale = d3.scaleLinear() //scale.linear()不起作用
                .domain([0, 1]).range([height - padding.top - padding.bottom, 0]);

            //创建坐标轴
            var xAxis = d3
                .axisBottom(this.xScale)
                .ticks(d3.timeMinute.every(30))
                .tickSize(-1 * this.containerHeight)
                .tickFormat((d)=>{
                    var date = new Date(d);
                    var mintue = date.getMinutes();
                    return mintue == 0
                        ? date.getHours() + ":" + date.getMinutes() + "0"
                        : null;
                });
            //
            // xAxis.select("line")
            //     .attr("stroke-width","10");

            var yAxis = d3.axisLeft(this.yScale).tickFormat("").tickSize(0);

            //把x轴应用到对应的SVG元素上
            g.append("g")
                .attr("class", "xaxis")
                .attr(
                    "transform",
                    "translate(0," + (height - padding.top - padding.bottom) + ")"
                )
                .call(xAxis)
                .call(g => g.select(".domain")
                    .remove())
                .call(g => g.selectAll(".tick:not(:first-of-type) line")
                    .attr("stroke-opacity", 0.5)
                    .attr("stroke-width", 1)
                    .attr("stroke-dasharray", "3,3"))
                // .selectAll("text")

            //把y轴应用到对应的SVG元素上
            g.append("g").attr("class", "yaxis").call(yAxis);
            //添加点和线的group

            //调整时间方法 增加一个brush在temporal view
            var xscale = this.xScale;
            var brush = d3
                .brushX()
                .extent([
                    [padding.left, padding.top],
                    [width - padding.right, height - padding.bottom],
                ])
                .on("end", brushended);
            var interval = d3.timeMinute.every(30);
            let _this = this;
            function brushended(event) {
                if (!event.sourceEvent) return;
                const d0 = event.selection.map(xscale.invert); //只需要x1 转化成了d3时间
                const d1 = d0.map(interval.round);
                // If empty when rounded, use floor instead.
                if (d1[0] >= d1[1]) {
                    d1[0] = interval.floor(d0[0]);
                    d1[1] = interval.offset(d1[0]);
                }

                if(d1[1] - d1[0] > 1800000){
                    // 如果大于半个小时，则改为半个小时， hard code
                    d1[1] = new Date(d1[0].getTime() + 1800000)
                }

                d3.select(this).transition(100).call(brush.move, d1.map(xscale))

                var date = new Date(d1[0]);
                var currentTime = date.getHours() + ":" + date.getMinutes() + ":00";
                _this.setCurrentTime(currentTime)
            }
            let currentDate = new Date()
            let currentRegionSize = xscale(new Date(currentDate.getTime() + 1800000)) - xscale(currentDate)
            g.append("g")
                .attr("class", "brush")
                .call(brush)
                .call(brush.move, [padding.left, currentRegionSize]);
        },
        getContiContourCenter(new_vals){
            // 计算contour位置 TODO
            const parseTime = d3.timeParse("%H:%M:%S");
            var xscale = this.xScale;
            var yscale = this.yScale;
            let timeList = []
            new_vals.forEach(d=>{
                let time = d.time;
                let contours = d.contours;
                let Time = parseTime(time)
                var _data = this.alldata_iou;
                var arr = [];
                let len = contours[0].coordinates.length;

                let points = []
                for(let i = 0; i < len; i++){
                    var coordinates = contours[0].coordinates[i][0]; //最外层的contour数据
                    var center = d3.polygonCentroid(coordinates);
                    var a = parseInt(center[0]); //x
                    var b = parseInt(center[1]); //y
                    var one_d =
                        ((b - 1) * this.mapCanvasWidth + a) /
                        (this.mapCanvasWidth * this.mapCanvasHeight); //一维点
                    arr.push(coordinates);
                    _data[time] = arr; //每一次的contour的值放进全局变量alldata_iou
                    points.push({
                        'x': xscale(Time),
                        'y': yscale(one_d)
                    })
                }
                timeList.push({
                    'time': time,
                    'points': points
                })

            })
            return timeList
        },
        calculate_iou(contourList, alldata_iou) {
            const parseTime = d3.timeParse("%H:%M:%S");
            contourList.forEach(d=>{
                let time = d.time;
                let contours = d.contours;
                var _data = this.alldata_iou;
                var arr = [];
                let len = contours[0].coordinates.length;
                for(let i = 0; i < len; i++){
                    var coordinates = contours[0].coordinates[i][0]; //最外层的contour数据
                    arr.push(coordinates);
                    _data[time] = arr; //每一次的contour的值放进全局变量alldata_iou
                }
            })

            //计算所有相邻时间点contour数据的重叠面积
            var timeKeyList = []; //
            for (var i in alldata_iou) {
                timeKeyList.push(i);
            }

            var xscale = this.xScale;
            var yscale = this.yScale;
            let line = d3
                .line()
                .x(function (d) {
                    return xscale(d.time);
                })
                .y(function (d) {
                    return yscale(d.center);
                });

            for (var j = 0; j < timeKeyList.length - 1; j++) {
                //-1以及j<是因为比较的最后一个数
                //两两比较计算它们的重叠面积
                for (var k = 0; k < alldata_iou[timeKeyList[j]].length; k++) {
                    for (var l = 0; l < alldata_iou[timeKeyList[j + 1]].length; l++) {
                        var data1 = alldata_iou[timeKeyList[j]][k]; //第一个比较的数据
                        var data2 = alldata_iou[timeKeyList[j + 1]][l]; //第二个比较的数据
                        var center1 = d3.polygonCentroid(data1); //获取data1数组的中心点
                        var center2 = d3.polygonCentroid(data2); //获取data2数组的中心点
                        var linedata = []; //用来存相邻两个中心点的坐标轴的数据

                        var a1 = center1[0];
                        var b1 = center1[1];
                        var one1 =
                            (a1 + (b1 - 1) * this.mapCanvasWidth) /
                            (this.mapCanvasWidth * this.mapCanvasHeight);
                        var a2 = center2[0];
                        var b2 = center2[1];
                        var one2 =
                            (a2 + (b2 - 1) * this.mapCanvasWidth) /
                            (this.mapCanvasWidth * this.mapCanvasHeight);
                        var tempdata1 = {};
                        tempdata1["time"] = parseTime(timeKeyList[j]);
                        tempdata1["center"] = one1; //只需要中心的纵坐标

                        var tempdata2 = {};
                        tempdata2["time"] = parseTime(timeKeyList[j + 1]);
                        tempdata2["center"] = one2;

                        linedata.push(tempdata1);
                        linedata.push(tempdata2);

                        // TODO 最好不要分批次传到后端计算，把所有的一次性传到后端计算完成；
                        let getConnection = (line1, line2, linedata) => {
                            calIOU(
                                {
                                    line1: line1,
                                    line2: line2,
                                },
                                (d) => {
                                    let path = line(linedata)
                                    if(d > 0){
                                        this.centerConnection.push({
                                            'path': path,
                                            'overlap': d
                                        })
                                    }
                                }
                            );
                        };
                        getConnection(data1, data2, linedata);
                    }
                }
            }
        }
    }
}
</script>

<style scoped>

</style>