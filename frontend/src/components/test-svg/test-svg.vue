<template>
    <svg>
        <circle :r="r" cx="100" cy="100"></circle>
    </svg>
</template>

<script>
export default {
    props:['counter'],
    name: "test-svg",
    computed:{
        r(){
            return this.counter
        }
    }
}
</script>

<style scoped>

</style>