<template>
    <div id="app" style="height: calc(100vh - 20px)">
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'App',
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    width: 100%;
}


.mini_head{
    background: rgb(243,243,243);
    width: 100%;
    height: 20px;
}
.mini_title{
    font-family: 'monospace';
    height: 20px;
    font-size: 13px;
    padding-left: 3px;
    display: table-cell;
    vertical-align: middle;
}
.boundary{
    border-style: dashed;
    border-color: #d3dce6;
    border-width: 1px;
}

.el-table .warning-row {
    background: #a6cee3;
}
.boundary {
    /*border-style: dashed;*/
    border-style: solid;
    border-color: #d3dce6;
    border-width: 0.5px;
    border-radius: 3px;
}


</style>
