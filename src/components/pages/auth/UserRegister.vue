<template>
<base-card>
  <form @submit.prevent="submitForm">
    <div class="form-control">
      <label for="name"> Nombre </label>
      <input type="text" id="name" v-model.trim="name"/>
    </div>
    <div class="form-control">
      <label for="surname"> Apellido </label>
      <input type="text" id="surname" v-model.trim="surname" />
    </div>
    <div class="form-control">
      <label for="email">E-mail </label>
      <input type="email" id="email" v-model.trim="email"/>
    </div>
    <div class="form-control">
      <label for="password">Password </label>
      <input type="password" id="password" v-model.trim="password"/>
    </div>
    <!--      <p v-if="!formIsValid">Please enter a vald email and password (at least 6 characters long)</p>-->
    <!--      <button> {{ submitButtonCaption }}</button>-->
    <!--      <button type="button" @click="switchAuthMode">{{switchModeButtonCaption}}</button>-->
    <button>Crear cuenta</button>
  </form>
</base-card>

</template>

<script>
import BaseCard from "../../ui/BaseCard";
import firebaseTool from "../../../firestore";
const db = firebaseTool.firestore();
export default {
  name: "UserRegister",
  components: {BaseCard},
  data(){
    return{
      email: '',
      password: '',
      name: '',
      surname: '',
      formIsValid: true,
      isLoading: false,
      error: null
    }
  },
  methods:{
    async submitForm(){
      this.formIsValid = true;
      if(
          this.email ==='' ||
          !this.email.includes('@') ||
          this.password.length < 6)
      {
        this.formIsValid = false;
        return;
      }
      this.isLoading = true;

      const actionPayload ={
        email: this.email,
        password: this.password
      };

      try{
        await this.$store.dispatch('signup', actionPayload);

        //create User with auth user data
        this.createUser();


        const redirectUrl = '/'+ (this.$route.query.redirect || 'dashboard');
        this.$router.replace(redirectUrl);
      } catch(err){
        this.error = err.message || 'Failed to authenticate, try later.';
      }

      this.isLoading= false;
    },
    createUser(){

      db.collection("usuarios").doc(this.$store.getters.userId).set({
        name: this.name,
        surname: this.surname,
        email: this.email,
        normal_price: 2.25,
        siblings_price: 2,
        final_hour: new Date(Date.UTC('2021','05','06','09','00','00')),
        years: []
      })
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
    }
  }
}
</script>

<style scoped>
input[type=email], input[type=password],input {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
button {
  background-color: #04AA6D;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
}
</style>