<template>
  <base-card>
    <h3>{{ month.month_name }} {{month.month_year}}</h3>
    <h3>{{ kid.name }} {{kid.surname}}</h3>
    <p>Monto: {{month.total_price}}</p>
    <p>Horas: {{month.total_hours}}</p>
    <p>Minutos: {{month.total_minutes}}</p>
    <p>Pagado: {{month.paid}}</p>
    <p>Tarifa: {{kid.fare}}</p>

    <div class="form-control">
      <label for="change_fare"> Precio Hermanos </label>
      <input type="checkbox" id="change_fare" v-model="siblingsPrice"/>
    </div>

    <div class="day-container">
      <table class="styled-table">
        <thead>
        <tr>
          <th>Dia</th>
          <th>Horas</th>
          <th>Minutos</th>
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
    <button v-if="!showSaveDay" type="button" @click="createDay">Añadir dia</button>

    <div v-if="showSaveDay">
      <div class="form-control">
        <label for="day"> Hora inicio </label>
        <input type="date" id="day" v-model="newDayDate"/>
      </div>
      <div class="form-control">
        <label for="initial_hour"> Hora inicio </label>
        <input type="time" id="initial_hour" v-model="newInitialHour"/>
      </div>
      <div class="form-control">
        <label for="final_hour"> Hora fin </label>
        <input type="time" id="final_hour" v-model="newFinalHour"/>
      </div>
      <button  type="button" @click="saveDay">Guardar</button>
    </div>
    {{newInitialHour}}-{{newFinalHour}}
    {{newDayDate}}

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
      newFinalHour: '',
      newDayMinutes: '',
      newDayPrice: '',
      siblingsPrice: false
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
    }
  },
  methods:{
    getKid(){
      var docRefKid = db.collection("kids").doc(this.$route.params.kidId/*this.kidId*/);
      docRefKid.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data kids:", doc.data());
          this.kid = doc.data();
          this.month = doc.data().months[/*this.monthId*/this.$route.params.monthId];
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
            this.showSaveDay = false;
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
</style>