/**
 * Created by yiding on 2017/1/12.
 */
import Vue from 'vue'

var pipeService = new Vue({
    data:{
        SIMULATION: 'simulation',
        DATATRANSIMITE: 'datatransmit',
        TIMEINTERVAL:   'timeinterval',
        ROUTEINFO : 'routeInfo'

    },
    methods:{
        emitRunSimulation: function(msg){
            this.$emit(this.SIMULATION, msg);
        },
        onRunSimulation: function(callback){
            this.$on(this.SIMULATION,function(msg){
                callback(msg);
            })
        },
        emitArray: function(msg){
            // console.log('emit array')
            this.$emit(this.DATATRANSIMITE, msg);
        },
        onArray: function(callback){
            // console.log('on array')
            this.$on(this.DATATRANSIMITE,function(msg){
                callback(msg);
            })
        },
        emitTime: function(msg){
            this.$emit(this.TIMEINTERVAL, msg);
        },
        onTime: function(callback){
            this.$on(this.TIMEINTERVAL,function(msg){
                callback(msg);
            })
        },
        emitRoute: function(msg){
            this.$emit(this.ROUTEINFO, msg);
        },
        onRoute: function(callback){
            this.$on(this.ROUTEINFO,function(msg){
                callback(msg);
            })
        }
    }
});

export default pipeService