/**
 * Created by yiding on 2017/1/12.
 */
import Vue from 'vue'

var pipeService = new Vue({
    data:{
        SIMULATION: 'simulation'

    },
    methods:{
        emitRunSimulation: function(msg){
            this.$emit(this.SIMULATION, msg);
        },
        onRunSimulation: function(callback){
            this.$on(this.SIMULATION,function(msg){
                callback(msg);
            })
        }
    }
});

export default pipeService