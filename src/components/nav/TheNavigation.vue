<template>
  <div class="main-header">
    <div id="mySidenav" v-if="showNav" class="sidenav">
      <a class="closebtn" @click="openNav">&times;</a>
      <router-link to="/login" v-if="!isLoggedIn" @click="openNav">Iniciar sesión</router-link>
      <router-link to="/register" v-if="!isLoggedIn" @click="openNav">Crear cuenta</router-link>
      <router-link to="/account" v-if="isLoggedIn" @click="openNav">Mi cuenta</router-link>
      <a class="logout" v-if="isLoggedIn" @click="logout">Cerrar sesión</a>

      <div v-if="isLoggedIn" class="year-nav">
        <ul>
          <li v-for="year in years" v-bind:key="year.id">
            <a>{{year.name}}</a>
            <button @click="deleteYear(year.name, year.id)" >borrar</button>
          </li>
        </ul>

        <button v-if="!showSaveYear" type="button" @click="createYear">Añadir año</button>
        <div v-if="showSaveYear">
          <div class="form-control">
            <label for="newYear"> Nombre (Ejem.: 2021) </label>
            <input type="number" id="newYear" v-model="newYear"/>
          </div>
          <button  type="button" @click="saveYear">Guardar</button>
        </div>
      </div>

    </div>

    <div class="sub-header">
      <div class="menu">
        <span  style="font-size:30px;cursor:pointer" @click="openNav">&#9776;</span>
      </div>
      <div class="app-name">
<!--        <span style="font-size:30px; text-align: center;">App</span>-->
        <router-link style="font-size:30px;" to="/" >Acollida</router-link>
      </div>
    </div>

  </div>
</template>

<script>
import firebaseTool from "../../firestore";
const db = firebaseTool.firestore();
export default {
  name: "TheNavigation",
  created(){
    if(this.isLoggedIn){
      this.getYearsByUser();
    }

  },
  data(){
    return{
      showNav: false,
      years: {},
      showSaveYear: false,
      newYear: "",
    }
  },
  computed:{
    isLoggedIn(){
      return this.$store.getters.isAuthenticated;
    }
  },
  methods:{
    openNav(){
      this.showNav = this.showNav === false;
    },

    logout(){
      this.$store.dispatch('logout');
      this.$router.replace('/login');
      this.openNav();
    },

    getYearsByUser(){
      var docRefUsuarios = db.collection("usuarios").doc(this.$store.getters.userId);

      docRefUsuarios.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data de user:", doc.data());
          console.log("años: ", doc.data().years);
          this.years = doc.data().years;
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    },

    createYear(){
      this.showSaveYear = true;
    },

    saveYear(){
      db.collection("years").add({
        year: this.newYear,
        months: {},
      })
          .then((docRef) => {
            console.log("Document successfully written!", docRef.id);
            this.addYearToUser(docRef.id);
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
    },

    addYearToUser(yearId){

      db.collection("usuarios").doc(this.$store.getters.userId).set({
        years:{
          [this.newYear]:{
            id: yearId,
            name: this.newYear
          }
        }
      },{ merge: true })
          .then(() => {
            console.log("Document successfully written year!");
            this.showSaveYear = false;
            this.getYearsByUser();
          })
          .catch((error) => {
            console.error("Error writing document year: ", error);
          });
    },

    deleteYear(yearName,yearId){
      console.log('delete year: ', yearId);
      db.collection("years").doc(yearId).delete().then(() => {
        console.log("Document successfully deleted!");
        this.deleteYearFromUser(yearName);
      }).catch((error) => {
        console.error("Error removing document: ", error);
      });

    },

    deleteYearFromUser(yearName){
      console.log(yearName);
      delete this.years[yearName];
      var years = this.years;
      var users = db.collection("usuarios").doc(this.$store.getters.userId);
      users.update({
        years
      },{ merge: true })
          .then(() => {
            console.log("Document successfully deleted year!");
          })
          .catch((error) => {
            console.error("Error writing document year: ", error);
          });
    },
  }
}
</script>

<style scoped>
.logout{
  position: fixed;
  bottom: 0;
}

.main-header{
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  padding-top: 0.8em;
  padding-bottom: 0.8em;
}
.sub-header{
  margin-left: 0.5em;
}
.closebtn{
  cursor: pointer;
}
.menu{
  width: 8%;
  display: inline-block;
}
.app-name{
  width: 90%;
  display: inline-block;
  text-align: center;
}
.app-name a{
  text-decoration: none;
  color: #2c3e50;
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
ul{
  color: white;
}
ul li{
  cursor: pointer;
}

@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}
</style>