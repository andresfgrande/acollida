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
    <div class="card" @click="goToMonth(month.name, month.month_id)" v-for="month in year.months" v-bind:key="month.month_id">
      <h4 class="link-go" >{{month.name}}</h4>
<!--      <a @click="goToMonth(month.name, month.month_id)">Ver</a>-->
    </div>


    <div v-if="showMonthOptions">

      <button v-if="!showSaveMonth" type="button" class="button-new-element" @click="createMonth">Añadir mes</button>
      <div v-if="showSaveMonth">
        <div class="form-control">
          <label for="name"> Nombre (Ejem.: Abril) </label>
          <input type="text" id="name" v-model="newMonthName"/>
        </div>
        <button  type="button" class="button-new-element" @click="saveMonth">Guardar</button>
      </div>

    </div>

  </div>



  <div v-if="showYearOptions">
    <button v-if="!showSaveYear" type="button" class="button-new-element" @click="createYear">Añadir año</button>
    <div v-if="showSaveYear">
      <div class="form-control">
        <label for="newYear"> Nombre (Ejem.: 2021) </label>
        <input type="number" id="newYear" v-model="newYear"/>
      </div>
      <button  type="button" class="button-new-element" @click="saveYear">Guardar</button>
    </div>
  </div>

<!--  {{yearsObject}}-->
<!--  <ul>-->
<!--    <li v-for="year in yearsObject" v-bind:key="year.id">-->
<!--      {{year.name}}-->
<!--    </li>-->
<!--  </ul>-->

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
      },
      showSaveMonth: false,
      newMonthName: '',
      newMonthYear: '',
      showMonthOptions: false,
      showSaveYear: false,
      newYear: "",
      showYearOptions: false,
      yearsObject: {},
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

          /*********************/
          console.log('TEST',doc.data().years);

          this.yearsObject = doc.data().years;
          var array = [];
          for (const year in doc.data().years){
            array.push(year)
          }
          console.log('TEST2', array);
          console.log('TEST3', array[array.length - 1]);

          if(array[array.length - 1] !== undefined){
            var currentYear = this.yearsObject[array[array.length - 1]]
            console.log('TEST4',currentYear.id);
            this.user.currentYearId = currentYear.id;

            console.log("current year", this.user.currentYearId);
            if(this.user.currentYearId !== undefined){
              this.getYear()
              this.showMonthOptions = true;
              this.showYearOptions = false;
            }else{
              this.showMonthOptions = false;
              this.showYearOptions = true;
            }
          }else{
            this.showMonthOptions = false;
            this.showYearOptions = true;
          }

          /***********************/

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
          this.newMonthYear = this.user.year;
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    },
    createMonth(){
      this.showSaveMonth = true;
    },
    createYear(){
      this.showSaveYear = true;
    },
    saveMonth(){
      db.collection("months").add({
        name: this.newMonthName,
        year: this.newMonthYear,
        kids: {},
      })
          .then((docRef) => {
            console.log("Document successfully written!", docRef.id);
            this.addMonthToYear(docRef.id)
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
    },

    saveYear(){
      db.collection("years").add({
        year: this.newYear,
        months: {},
      })
          .then((docRef) => {
            console.log("Document successfully written!", docRef.id);
            this.user.currentYearId = docRef.id;
            this.addYearToUser(this.user.currentYearId);
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
    },


    addMonthToYear(monthId){
      db.collection("years").doc(this.user.currentYearId).set({
        months: {
          [monthId]: {
            month_id:monthId,
            name: this.newMonthName,
          },
        },

      },{ merge: true })
          .then(() => {
            console.log("Document successfully written!");
            this.showSaveMonth = false;
            this.getYear();
            this.newMonthName = "";
          })
          .catch((error) => {
            console.error("Error writing document year: ", error);
          });
    },

    addYearToUser(yearId){

      console.log('heyyy2',this.user.year);
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
            this.showSaveMonth = false;
            this.showSaveYear = false;
            this.getYear();
            this.showYearOptions = false;
            this.showMonthOptions = true;
            this.newYear = "";
          })
          .catch((error) => {
            console.error("Error writing document year: ", error);
          });
    }
  },

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
  cursor: pointer;
}

.card:hover{
  background-color: #0a8e5d;
}

.cards {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-gap: 1rem;
}

input[type=text]{
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-control{
  margin-top: 1.2em;
}

.button-new-element{
  background-color: #3077a0;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  margin-top: 1.5em;
  border-radius: 5px;
  margin-left: 5%;
}
.button-new-element:hover{
  background-color: #2a698e;
}

.link-go{
  cursor: pointer;
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
.form-control label{
  display: block;
}
.form-control{
  margin-left: 5%;
}

input[type=text]{
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
input[type=number]{
  width: 30%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>