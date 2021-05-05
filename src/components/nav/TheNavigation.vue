<template>
  <div class="main-header">
    <div id="mySidenav" v-if="showNav" class="sidenav">
      <a href="javascript:void(0)" class="closebtn" @click="openNav">&times;</a>
      <a href="#">About</a>
      <a href="#">Services</a>
      <a href="#">Clients</a>
      <a href="#">Contact</a>
    </div>

    <span class="sub-header" style="font-size:30px;cursor:pointer" @click="openNav">&#9776; acollida</span>
  </div>
</template>

<script>
export default {
  name: "TheNavigation",
  data(){
    return{
      showNav: false,
    }
  },
  methods:{
    openNav(){
      this.showNav = this.showNav === false;
    }
  }
}
</script>

<style scoped>
.main-header{
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  padding-top: 0.7em;
  padding-bottom: 0.7em;
}
.sub-header{
  margin-left: 0.5em;
}
.sidenav {
  height: 100%;
  width: 250px;
  position: fixed;
  z-index: 1;
  top: 0;

  background-color: #111;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
}

.sidenav a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
  transition: 0.3s;
}

.sidenav a:hover {
  color: #f1f1f1;
}

.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}
</style>