<template>

  <div class="my-account">
    <h3>Mi cuenta</h3>
    <base-card>
      <h4>{{user.name}} {{user.surname}}</h4>

      <p style="font-weight: bold;">{{user.email}}</p>

      <p>Precio normal</p>
      {{user.normal_price}}
      <p>Precio de hermanos</p>
      {{user.siblings_price}}
      <p>Hora finalización</p>
      {{user.final_hour}}
    </base-card>
  </div>


</template>

<script>
import BaseCard from "../../../ui/BaseCard";
import firebaseTool from "../../../../firestore";
const db = firebaseTool.firestore();
export default {
  name: "Account",
  components: {BaseCard},
  data(){
    return{
      user:{
        name: '',
        surname: '',
        email: '',
        normal_price:'',
        siblings_price: '',
        final_hour:''
      }
    }
  },
  created(){
    this.getUserData();
  },
  methods:{
    getUserData(){
      var docRef = db.collection("usuarios").doc(this.$store.getters.userId);

      docRef.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          this.user = doc.data();
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });

    }
  }
}
</script>

<style scoped>
h3{
  text-align: center;
}
.my-account{
  text-align: center;
}
</style>