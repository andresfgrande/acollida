<template>
<h3 class="title">{{user.year}}</h3>
<!--  <ul>-->
<!--    <li v-for="item in usersList" v-bind:key="item.id">-->
<!--      {{item.data.name}}-->
<!--    </li>-->
<!--  </ul>-->
<!--  <ul>-->
<!--    <li v-for="month in year.months" v-bind:key="month.month_id">-->
<!--      {{month.name}}-->
<!--    </li>-->
<!--  </ul>-->
<!--  {{year}}-->

  <div class="cards">
    <div class="card" v-for="month in year.months" v-bind:key="month.month_id">
      <h4>{{month.name}}</h4>
      <a @click="goToMonth(month.name, month.month_id)">Ver</a>
    </div>
  </div>

</template>

<script>
import firebaseTool from "../../../../firestore";
const db = firebaseTool.firestore();

export default {
  name: "Dashboard",
  created(){
    this.getUsers();
    this.getCurrentYearData();
  },
  data(){
    return{
      usersList:[],
      user:{
        year:'',
        currentYearId: '',
      },
      year:{
        months: [],
      }
    }
  },

  methods:{
    goToMonth(month_name, month_id){
     var year = this.user.year;
      this.$router.push({name:'month', params:{ name: month_name, year: year, monthId: month_id}});
    },
    getUsers(){
      // this.$store.getters.userIsAuthenticated;
      console.log('holaaaaa',this.$store.getters.userId);
      // var usuarios = db.collection("usuarios").doc("2Qjn6e4UP0qZD11NL1oQ");
      var usuarios = db.collection("usuarios");
      //
      // usuarios.get().then((doc) => {
      //   if (doc.exists) {
      //     console.log("Document data:", doc.data());
      //   } else {
      //     // doc.data() will be undefined in this case
      //     console.log("No such document!");
      //   }
      // }).catch((error) => {
      //   console.log("Error getting document:", error);
      // });

      usuarios.get()
          .then((r) => r.docs.map(
              (item)=> this.usersList.push({id:item.id, data:item.data()})
          ))

      console.log(this.usersList);

    },

   getCurrentYearData(){
      var docRefUsuarios = db.collection("usuarios").doc(this.$store.getters.userId);

      docRefUsuarios.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          this.user.currentYearId = doc.data().years[0];
          console.log("current year", this.user.currentYearId);
          this.getYear()
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    },

   getYear(){
      var docRefYears = db.collection("years").doc(this.user.currentYearId);
      docRefYears.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          this.user.year = doc.data().year;
          this.year.months = doc.data().months;
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