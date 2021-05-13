<template>
  <base-card>
    <form @submit.prevent="submitForm">
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
      <button>Iniciar sesión</button>
    </form>
  </base-card>

</template>

<script>
import BaseCard from "../../ui/BaseCard";
export default {
  name: "UserLogin",
  components: {BaseCard},

  data(){
    return{
      email: '',
      password: '',
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
        await this.$store.dispatch('login', actionPayload);
        const redirectUrl = '/'+ (this.$route.query.redirect || 'dashboard');
        this.$router.replace(redirectUrl);
      } catch(err){
        this.error = err.message || 'Failed to authenticate, try later.';
      }

      this.isLoading= false;
    }

  }
}
</script>

<style scoped>
input[type=email], input[type=password] {
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
button:hover {
  opacity: 0.8;
}
</style>