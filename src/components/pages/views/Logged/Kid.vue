<template>
  <base-card>
    <h3>{{ kid.name }} {{kid.surname}}</h3>
    <p>Monto: {{month.total_price}}</p>
    <p>Horas: {{month.total_hours}}</p>

    <ul> <!--TODO Hacer como componente DiaItem -->
      <li v-for="day in month.days" v-bind:key="day">
        {{day}}
      </li>
    </ul>
  </base-card>


</template>

<script>
import firebaseTool from "../../../../firestore";
const db = firebaseTool.firestore();
import BaseCard from "../../../ui/BaseCard";
export default {
  name: "Kid",
  props:['kidId'],
  components: {BaseCard},
  data(){
    return{
      kid:'',
      month:''
    }
  },
  created(){
    //TODO Current kid vuex
    this.getKid();
  },
  methods:{
    getKid(){
      var docRefKid = db.collection("kids").doc(this.kidId);
      docRefKid.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data kids:", doc.data());
          this.kid = doc.data();
          this.month = doc.data().months["8jyzmFMroEGL7jefDnec"];
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
</style>