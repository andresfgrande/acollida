<template>
<!--<div class="day-item">-->
<!--<p>{{day.day}} {{day.initial_hour}} {{day.final_hour}} {{day.day_minutes}}</p>-->
<!--</div>-->
          <tr>
            <td>{{day.day}}</td>
            <td>{{day.initial_hour}} - {{day.final_hour}}</td>
            <td>{{day.day_minutes}}</td>
            <td>{{day.day_price}}</td>
          </tr>
</template>

<script>
import firebaseTool from "../../../../firestore";
const db = firebaseTool.firestore();

export default {
  name: "DayItem",
  props: ['dayId_prop'],
  created(){
    this.dayId = this.dayId_prop;
    this.getDayData();
  },
  data(){
    return{
      dayId: '',
      day:''
    }
  },
  methods:{
    getDayData(){
      var docRefDay = db.collection("days").doc(this.dayId);
      docRefDay.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data day:", doc.data());
          this.day = doc.data();
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