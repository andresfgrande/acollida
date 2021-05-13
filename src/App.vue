<template>
  <the-navigation></the-navigation>
  <main>
    <router-view></router-view>
  </main>
</template>

<script>
import TheNavigation from './components/nav/TheNavigation';

export default {
  name: 'App',
  components: {
    TheNavigation
  },
  created(){
    this.$store.dispatch('tryLogin');
  },
  watch:{
    didAutoLogout(curvalue, oldValue){
      if(curvalue && curvalue !== oldValue){
        this.$router.replace('/login');
      }
    }
  },
  computed:{
    isAuth(){
      return this.$store.getters.userIsAuthenticated;
    },
    didAutoLogout(){
      return this.$store.getters.didAutoLogout;
    }
  },
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
