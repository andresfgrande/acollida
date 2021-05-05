<template>
<!--  <img alt="Vue logo" src="./assets/logo.png">-->
<!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  <the-navigation></the-navigation>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import TheNavigation from './components/nav/TheNavigation';

export default {
  name: 'App',
  components: {
    // HelloWorld
    TheNavigation
  }
}
</script>

<style>
body{
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
