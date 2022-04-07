<template>
    <div >
        <el-table v-if="tableHeight!=undefined"
                  size="mini"
                  :data="tableData"
                  style="width: 100%"

                  :height="tableHeight"
                  :row-class-name="tableRowClassName"
                  :default-sort = "{prop: 'route_id', order: 'descending'}"

                  @row-click="rowClick"
        >
            <el-table-column
                    prop="route_id"
                    label="ID"
                    sortable
                    width="100"
            >
            </el-table-column>
            <el-table-column
                    prop="trip"
                    label="Trip ID"
                    sortable
                    width="100"
            >
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="Type"
                    sortable
            >
            </el-table-column>
            <el-table-column
                    prop="uncertainty_mean"
                    label="Uncertainty"
                    sortable
            >
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "RouteTable",
    props:['alldata'],
    data(){
        return {
            tableHeight: undefined,
            selectedIndex: -1,
            selectedRow: undefined,
        }
    },
    mounted(){
        this.tableHeight=this.$el.clientHeight
    },
    methods:{
        rowClick(row){
            if(this.selectedRow == row){
                this.selectedRow = undefined
            }else{
                 this.selectedRow = row
            }
            this.$store.commit('test/selectRoute', row)
        },
        tableRowClassName(data) {
            if (data.row === this.selectedRow) {
                return 'warning-row';
            }
            return '';
        }
    },
    computed: {
        tableData(){
            // TODO: 表格处理函数，还没改过
            var table = [];
            for (var routeID in this.alldata) {
                var uncertainty = [];
                var global = 0;
                var station_count = 0;
                var temp = {};
                for (var global_order in this.alldata[routeID]) {
                    global++;
                    for (var i in this.alldata[routeID][global_order]) {
                        uncertainty.push(
                            this.alldata[routeID][global_order][i]["uncertainty"]
                        );
                        station_count++;
                    }
                }
                var uncertainty_sum = eval(uncertainty.join("+"));
                var global_count = global;
                var uncertainty_mean = uncertainty_sum / station_count;
                var route_id = routeID.substring(0, 5);
                if (routeID.substring(6, 7) == 1) {
                    var type = "up";
                } else {
                    type = "down";
                }
                temp["route_id"] = route_id;
                temp["type"] = type;
                temp["trip"] = global_count;
                // temp["uncertainty_mean"] = uncertainty_mean.toFixed(2) //两位数
                temp["uncertainty_mean"] = parseInt(uncertainty_mean);
                table.push(temp);
            }
            return table
        }
    }
}
</script>

<style scoped>


</style>