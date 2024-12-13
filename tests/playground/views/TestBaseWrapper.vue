<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
    name: "TestBaseWrapper"
})
</script>

<template>
    <div class="test-base-wrapper">
        <h1>TestBase wrapper</h1>
        <RouterView />
    </div>
</template>

<style scoped lang="scss">

</style>