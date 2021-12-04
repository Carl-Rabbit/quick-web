<template>
  <div class="hello">
    <p>Current counter: {{ counter }}</p>
    <el-button @click="click">Update</el-button>
  </div>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: 'TestComponent',
    methods: {
      click() {
        this.$store.dispatch('test/updateCounter');
      }
    },
    computed: {
      ...mapState('test', {
        counter: state => state.counter,
      }),
    }
  }
</script>

<style scoped>

</style>
