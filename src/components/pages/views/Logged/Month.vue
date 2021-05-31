<template>
  <h3 class="title"> {{ monthData.name }} {{monthData.year}}</h3>
<!--  <p>{{monthData}}</p>-->

  <div class="cards"> <!--TODO Hacer como componente KidItem-->
    <div class="card" v-for="kid in monthData.kids" v-bind:key="kid.kid_id">
      <h4>{{kid.name}} {{kid.surname}}</h4>
      <a @click="goToKid(kid.name, kid.kid_id)">Ver</a>
    </div>
  </div>
</template>

<script>
import firebaseTool from "../../../../firestore";
const db = firebaseTool.firestore();
export default {
  name: "Month",
  props: ['monthId'],
  created(){
    this.getAlumnosFromMonth();
    console.log(this.monthId);
  },
  data(){
    return{
      month:{
        monthId: '',
      },
      monthData:{}
    }
  },
  methods:{
    goToKid(name, id){
      this.$router.push({name:'kid', params:{ name: name, kidId: id, monthId: this.$route.params.monthId/*this.monthId*/}});
    },
    getAlumnosFromMonth(){
      var docRefAlumnos = db.collection("months").doc(this.$route.params.monthId/*this.monthId*/);

      docRefAlumnos.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data().kids);
          this.month.kids = doc.data().kids;
          this.month.monthId = this.monthId;
          this.monthData = doc.data();
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    },
  }
}
</script>

<style scoped>
.title{
  text-align: center;
}
.card {
  /*background-color: dodgerblue;*/
  background-color: #04AA6D;
  color: white;
  padding: 1rem;
  height: 4rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}

.cards {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-gap: 1rem;
}


@media (max-width: 1200px) {
  .cards {
    margin-left: 1em;
    margin-right: 1em;
  }
}

@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 768px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 340px) {
  .cards { grid-template-columns: repeat(1, 1fr); }
}
</style>