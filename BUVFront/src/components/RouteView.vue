<template>
    <div>
        <el-row style="width: 100%; height: 100%">
            <div id="line_view" style="width: 100%; height: 100%">
            </div>
        </el-row>
    </div>
</template>

<script>
import * as d3 from "d3";

export default {
    name: "RouteView",
    props:['route', 'alldata', 'selectedRoute'],
    data(){
        return {
            containerWidth: 0,
            containerHeight: 0
        }
    },
    mounted(){
        this.containerWidth = this.$el.clientWidth;
        this.containerHeight=  this.$el.clientHeight;
        console.log('RouteView: ',this.route, this.alldata)
    },

    methods:{
        setSvg(rowdata) {

            this.routeinfo = rowdata;
            // console.log(this.routeinfo )
            if (rowdata["type"] == "up") {
                var routeid = rowdata["route_id"] + "/1";
            } else {
                routeid = rowdata["route_id"] + "/2";
            }
            d3.select("#line_view").selectAll("svg").remove();
            var rawdata = [];
            for (var global_order in this.alldata[routeid]) {
                //代表是一条一条画的
                for (var i in this.alldata[routeid][global_order]) {
                    var temp = {};
                    temp["stop_order"] =
                        this.alldata[routeid][global_order][i]["station_order"];
                    temp["arrive_time"] = this.convertTime(
                        this.alldata[routeid][global_order][i]["time_mean"]
                    );
                    rawdata.push(temp);
                }
            }

            //下面是svg画图的常见步骤 先添加一个画布

            var padding = { left: 30, top: 30, right: 20, bottom: 20 }; //画布周边的空白

            var svg = d3
                .select("#line_view")
                .append("svg")
                .attr("width", this.containerWidth)
                .attr("height", this.containerHeight);

            var g = svg
                .append("g") //向svg元素中添加一个g元素
                .attr(
                    "transform",
                    "translate(" + padding.top + "," + padding.left + ")"
                );
            //将数据的时间转化成d3能识别的时间
            const parseTime = d3.timeParse("%H:%M:%S");
            rawdata.forEach(function (d) {
                d.arrive_time = parseTime(d.arrive_time);
            });
            // console.log(rawdata);
            //创建x轴比例尺
            var Xmin = parseTime("06:00:00");
            var Xmax = parseTime("24:00:00");
            var xscale = d3
                .scaleTime()
                .domain([Xmin, Xmax]) // 设置区间大小
                .range([0, this.containerWidth - padding.left - padding.right]) //将domain的值映射到range
                .nice(); //映射域:画布区域

            var Ymax = d3.max(rawdata, function (d) {
                return parseInt(d.stop_order);
            });
            var Ymin = d3.min(rawdata, function (d) {
                return parseInt(d.stop_order);
            });

            //定义y轴比例尺
            var yscale = d3
                .scaleLinear()
                .domain([Ymin, Ymax])
                .range([this.containerHeight - padding.top - padding.bottom, 0])
                .nice(); //改变函数的domain,能自动把 0.00000000000001 变为最接近它的0,9.999999991 变为最接近它的10

            //创建坐标轴 用axisBottom创建一个向下的坐标轴，并通过scale调用设置好的比例尺
            var xAxis = d3
                .axisBottom(xscale)
                .ticks(d3.timeMinute.every(180))
                .tickFormat(function (d) {
                    var date = new Date(d);
                    var hour = date.getHours();
                    return hour % 2 == 0
                        ? date.getHours() + ":" + date.getMinutes() + "0"
                        : null;
                });

            var yAxis = d3.axisLeft(yscale);

            // 画布添加y轴
            g.append("g") //添加g元素
                // .attr("transform", "translate(100,200)") //设置偏移量 坐标轴的位置，可以通过 transform 属性来设定
                .call(yAxis); //表示调用上面定义的函数实现执行该函数，和java通过方法名调用函数执行是一个原理，只是java不用通过call
            // 添加x轴
            g.append("g") //添加g元素
                .attr(
                    "transform",
                    "translate(0," + (this.containerHeight - padding.top - padding.bottom) + ")"
                ) //设置偏移量
                .call(xAxis); //通过call方法填充至画布上将轴线汇入
            g.selectAll("circle")
                .data(rawdata)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return xscale(d.arrive_time);
                })
                .attr("cy", function (d) {
                    return yscale(d.stop_order);
                })
                .attr("r", 2)
                .attr("fill", "blue");
            for (var order in this.alldata[routeid]) {
                var pathdata = [];
                for (var j in this.alldata[routeid][order]) {
                    var obj = {};
                    obj["stop_order"] = this.alldata[routeid][order][j]["station_order"];
                    obj["arrive_time"] = this.convertTime(
                        this.alldata[routeid][order][j]["time_mean"]
                    );
                    pathdata.push(obj);
                }
                pathdata.forEach(function (d) {
                    d.arrive_time = parseTime(d.arrive_time);
                });
                let line = d3
                    .line()
                    .x(function (d) {
                        return xscale(d.arrive_time);
                    })
                    .y(function (d) {
                        return yscale(d.stop_order);
                    });
                // 添加折线 添加path元素，并通过line()计算出值来赋值 path就是一个画图的路径
                g.append("path")
                    .datum(pathdata)
                    .attr("stroke-width", 2) //attr表示定义了一个类，这个类用于设置样式，和css中的类样式一样
                    .attr("d", line(pathdata))
                    .attr("stroke", "blue")
                    .attr("fill", "none");
            }

        },
        convertTime(value) {
            //将json的time_mean转化成时分秒
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
    },
    watch:{
        selectedRoute(data){
            this.setSvg(data)
        }
    }
}
</script>

<style scoped>

</style>