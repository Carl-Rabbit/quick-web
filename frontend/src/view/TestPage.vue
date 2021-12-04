<template>
  <div class="main-page">
    <TestComponent/>
  </div>
</template>

<script>
  import TestComponent from "@/components/test-page/TestComponent";

  export default {
    name: 'TestPage',
    components: {
      TestComponent,
    }
  }
</script>

<style scoped>

</style>
