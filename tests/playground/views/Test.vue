<template>
    <div class="test">
        <HeaderLine />
       Test
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import HeaderLine from "./components/HeaderLine.vue";

    export default Vue.extend({
        name: "Test",
        components: {
            HeaderLine
        },
        data() {
            return {
                count: 0,
            };
        }
    });
</script>

<style lang="scss">
   .test {
     background: #000000;
   }
</style>
