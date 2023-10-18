<template>
  <div id="app">
    <router-view/>
    <chat-modal-container />
  </div>
</template>

<script>

import ChatModalContainer from "@/components/ChatModalContainer.vue";
export default {
  name: "App",
  components: {
    ChatModalContainer,
  },
};

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
