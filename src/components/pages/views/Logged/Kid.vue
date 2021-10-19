<template>

  <base-card>
    <button class="link-atras" @click="goToMonth(month.month_name, month.month_year)">Ver {{ month.month_name }} {{month.month_year}}</button>
    <h3 class="month-data">{{ month.month_name }} {{month.month_year}}</h3>

    <h3 class="kid-name">{{ kid.name }} {{kid.surname}}</h3>
    <div class="info-actualizada">
      <div class="row">
        <div class="column" >
          <p>Monto: {{month.total_price}}</p>
          <p>Horas: {{month.total_hours}}</p>
          <p>Minutos: {{month.total_minutes}}</p>
        </div>
        <div class="column" >
          <p>Pagado: {{month.paid}}</p>
          <p>Tarifa: {{kid.fare}}</p>
          <div class="form-control">
            <input type="checkbox" id="change_fare" v-model="siblingsPrice"/>
            <label for="change_fare"> Precio Hermanos </label>
          </div>

          <div class="form-control">
            <input type="checkbox" id="change_paid" v-model="isPaid"/>
            <label for="change_paid"> Marcar como pagado</label>
          </div>
        </div>
      </div>
    </div>



    <div class="day-container">
      <table class="styled-table">
        <thead>
        <tr>
          <th>Dia</th>
          <th>Horas</th>
          <th>Min.</th>
          <th>Precio</th>
        </tr>
        </thead>
        <tbody>
          <day-item v-for="day in month.days" :key="day"
                    v-bind:day-id_prop="day"
          ></day-item>
        </tbody>
      </table>
    </div>
    <button class="button-new-element" v-if="!showSaveDay" type="button" @click="createDay">Añadir dia</button>

    <div v-if="showSaveDay">
      <div class="form-control">
        <label for="day"> Fecha inicio </label>
        <input type="date" id="day" v-model="newDayDate"/>
      </div>
      <div class="form-control">
        <label for="initial_hour"> Hora inicio </label>
        <input type="time" id="initial_hour"  v-model="newInitialHour"/>
      </div>
      <div class="form-control">
        <label for="final_hour"> Hora fin </label>
        <input type="time" id="final_hour" v-model="newFinalHour"/>
      </div>
      <button class="button-new-element" type="button" @click="saveDay">Guardar</button>
    </div>

  </base-card>
</template>

<script>
import firebaseTool from "../../../../firestore";
const db = firebaseTool.firestore();
import BaseCard from "../../../ui/BaseCard";
 import DayItem from "./DayItem";
export default {
  name: "Kid",
  props:['kidId','monthId'],
  components: {BaseCard, DayItem},
  data(){
    return{
      kid:'',
      month:'',
      showSaveDay: false,
      newDayDate : '',
      newInitialHour: '',
      newFinalHour: '09:00',
      newDayMinutes: '',
      newDayPrice: '',
      siblingsPrice: false,
      isPaid: false,
    }
  },
  created(){
    this.getKid();
  },

  watch:{
    siblingsPrice(){
      if(this.siblingsPrice === true){
        this.kid.fare = 2;
      }else{
        this.kid.fare = 2.25;
      }

      db.collection("kids").doc(/*this.kidId*/this.$route.params.kidId).set({
        fare: this.kid.fare,

      }, { merge: true })
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
    },

    isPaid(){
      var pagado = false;
      if(this.isPaid === true){
       pagado = true;
       this.month.paid = true;
      }else{
        this.month.paid = false;
      }

      var monthId_string = this.monthId;

      db.collection("kids").doc(/*this.kidId*/this.$route.params.kidId).set({
        months: {
          [monthId_string]: {
            paid: pagado,
          },
        },

      }, { merge: true })
          .then(() => {
            console.log("Document successfully written!");
            this.isPaid = pagado;
            this.setPaid(this.isPaid);
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });

    }
  },
  methods:{
    goToMonth(month, year){
      this.$router.push({name:'month', params:{ name: month, year: year, monthId: this.$route.params.monthId/*this.monthId*/}});
    },
    getKid(){
      var docRefKid = db.collection("kids").doc(this.$route.params.kidId/*this.kidId*/);
      docRefKid.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data kids:", doc.data());
          this.kid = doc.data();
          this.month = doc.data().months[/*this.monthId*/this.$route.params.monthId];
          if( this.kid.fare === 2){
            this.siblingsPrice = true;
          }
          if(this.month.paid === true){
            this.isPaid = true;
          }
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    },
    createDay(){
      this.showSaveDay = true;
    },
    dayValues(){

      //Dia fecha
      var fecha = this.newDayDate;
      this.newDayDate = fecha.split(" ")[0].split("-").reverse().join("/");

      //Dia minutos
      var init_hour = this.newInitialHour;
      var final_hour = this.newFinalHour;

      var init_hour_array = init_hour.split(":");
      var final_hour_array = final_hour.split(":");

      var totalMinutosInicio = parseInt(init_hour_array[0])*60 + parseInt(init_hour_array[1]);
      var totalMinutosFinal = parseInt(final_hour_array[0]*60) + parseInt(final_hour_array[1]);
      this.newDayMinutes = totalMinutosFinal - totalMinutosInicio;

      //Dia precio
      var min = parseFloat(this.newDayMinutes);
      var fare = parseFloat(this.kid.fare);
      this.newDayPrice = (min*((fare/60)*5))/5;
    },
    saveDay(){
      this.dayValues();
      db.collection("days").add({
        day: this.newDayDate,
        // day_hours: 1,
        day_minutes: this.newDayMinutes,
        day_price: this.newDayPrice,
        final_hour: this.newFinalHour,
        initial_hour: this.newInitialHour,
      })
          .then((docRef) => {
            console.log("Document successfully written!", docRef.id);
            this.addDayToKid(docRef.id);
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
    },
    addDayToKid(dayId){
       var days = this.month.days;
       days.push(dayId);
       var monthId_string = this.monthId;

       /**************/
        this.month.total_minutes = parseInt(this.month.total_minutes) + parseInt(this.newDayMinutes);
        var horas_float = parseInt(this.month.total_minutes)/60;
        var horas = parseInt(horas_float);
        var minutos = (horas_float - horas)*60
        this.month.total_hours = horas + ":" + minutos;
        this.month.total_price = parseFloat(this.month.total_price) + parseFloat(this.newDayPrice);
      /***************/

      db.collection("kids").doc(/*this.kidId*/this.$route.params.kidId).set({
        months: {
          [monthId_string]: {
            'days':days,
            total_hours: this.month.total_hours,
            total_minutes: this.month.total_minutes,
            total_price: this.month.total_price
          },
        },

      }, { merge: true })
          .then(() => {
            console.log("Document successfully written!");
            this.updateKidInMonth();
            this.showSaveDay = false;
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
    },
    updateKidInMonth(){
      db.collection("months").doc(this.monthId).set({
        kids: {
          [this.$route.params.kidId]: {
            total_price: this.month.total_price,
          },
        },

      }, { merge: true })
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
    },

    setPaid(paid){
      db.collection("months").doc(this.monthId).set({
        kids: {
          [this.$route.params.kidId]: {
            paid: paid,
          },
        },

      }, { merge: true })
          .then(() => {
            console.log("Document successfully written Paid!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
    },
  }
}
</script>

<style scoped>
h3{
  text-align: center;
}

.form-control{
  margin-bottom: 0.7em;
}
.month-data{
  font-weight: normal;
}
.kid-name{
  font-size: 1.3rem;
}
.month-data{
  text-transform: uppercase;
}
.column p{
  font-weight: bold;
}
.styled-table {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}
.styled-table thead tr {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}
.styled-table th,
.styled-table td {
  padding: 12px 15px;
}
.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}
.styled-table tbody tr.active-row {
  font-weight: bold;
  color: #009879;
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
}
.button-new-element:hover{
  background-color: #2a698e;
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
input[type=date]{
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .card{
    /*margin-right: 1em;*/
    /*margin-left: 1em;*/
  }
}
@media (max-width: 500px) {
  * {
    box-sizing: unset;
  }
  .column {
    width: 100%;
  }
}
@media (min-width: 500px) {
  * {
    box-sizing: border-box;
  }
}

/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 50%;
  padding: 10px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
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
}
</style>

