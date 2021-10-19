<template>
  <button class="link-atras" @click="goToDashboard()">Ver año {{monthData.year}}</button>
  <h3 class="title"> {{ monthData.name }} {{monthData.year}}</h3>
<!--  <p>{{monthData}}</p>-->

  <div class="cards">

    <div class="card" v-bind:class="{ 'no-paid-card': !kid.paid}"
         v-for="kid in monthData.kids" v-bind:key="kid.kid_id" @click="goToKid(kid.name, kid.kid_id)">
      <p class="paid" v-if="!kid.paid">No pagado</p>
      <p class="paid" v-if="kid.paid">Pagado</p>
      <h4 class="alumno-name">{{kid.name}} {{kid.surname}}</h4>
      <p class="price">Monto: {{kid.total_price}}€</p>
    </div>
    <button v-if="!showSaveKid" class="button-new-element" type="button" @click="createKid">Añadir niño</button>

    <div v-if="showSaveKid">
      <div class="form-control">
        <label for="name"> Nombre </label>
        <input type="text" id="name"  v-model="newName"/>
      </div>
      <div class="form-control">
        <label for="surname"> Apellido </label>
        <input type="text" id="surname"  v-model="newSurname"/>
      </div>
      <div class="form-control">
        <label for="final_hour"> Hora fin </label>
        <input type="time" id="final_hour" v-model="newKidFinalHour"/>
      </div>
      <div class="form-control">
        <label for="fare"> Tarifa </label>
        <input type="number" id="fare" v-model="newFare"/>
      </div>
      <button  type="button" @click="saveKid" class="button-new-element">Guardar</button>
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
      monthData:{},
      showSaveKid: false,
      newKidFinalHour: '09:00',
      newName: '',
      newFare: 2.25,
      newSurname: ''
    }
  },
  methods:{
    goToKid(name, id){
      this.$router.push({name:'kid', params:{ name: name, kidId: id, monthId: this.$route.params.monthId/*this.monthId*/}});
    },
    goToDashboard(){
      this.$router.push({name:'dashboard'});
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

    createKid(){
      this.showSaveKid = true;
    },
    saveKid(){
      db.collection("kids").add({
        fare: parseFloat(this.newFare),
        final_hour: this.newKidFinalHour,
        name: this.newName,
        surname: this.newSurname,
        months: {
          [this.month.monthId]: {
            'days':[],
            month_name: this.monthData.name,
            month_year: this.monthData.year,
            paid: false,
            total_hours: 0,
            total_minutes: 0,
            total_price: 0
          },
        },
      })
          .then((docRef) => {
            console.log("Document successfully written!", docRef.id);
            this.addKidToMonth(docRef.id)
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
    },
    addKidToMonth(kidId){
      db.collection("months").doc(this.month.monthId).set({
        kids: {
          [kidId]: {
            kid_id:kidId,
            name: this.newName,
            surname: this.newSurname,
            paid: false,
            total_price: 0,
          },
        },

      }, { merge: true })
          .then(() => {
            console.log("Document successfully written!");
            this.showSaveKid = false;
            this.getAlumnosFromMonth();
            this.newName = "";
            this.newSurname = "";
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
    },
  }
}
</script>

<style scoped>
.title{
  text-align: center;
}
.card:hover{
  background-color: #0a8e5d;
}
.card {
  /*background-color: dodgerblue;*/
  background-color: #04AA6D;
  color: white;
  padding: 1rem;
  /*height: 4rem;*/
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  cursor: pointer;
}

.no-paid-card{
  background-color: #c56060;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  cursor: pointer;
}
.no-paid-card:hover{
  background-color: #934343;
}

.paid{
  font-weight: bold;
  text-align: right;
  margin-top: 0.5em;
  margin-bottom: 1.5em;
}
.alumno-name{
  text-transform: uppercase;
  text-align: center;
}
.price{
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.5em;
  text-align: center;
}

.cards {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-gap: 1rem;
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
  max-height: 4rem;
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
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
input[type=time]{
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
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

.link-atras{
  background-color: #ccc;
  border: none;
  color: black;
  padding: 10px 20px;
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
</style>