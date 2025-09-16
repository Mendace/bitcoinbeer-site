<template>
    <div v-if="eventData" class="event-container">
      <!-- Parte sinistra: box bianco con il numero del giorno -->
      <div class="event-left">
        <div class="event-day">{{ dayNumber }}</div>
      </div>
      <!-- Parte destra: area trasparente con mese e descrizione -->
      <div class="event-right">
        <div class="event-month">{{ monthName.toUpperCase() }}</div>
        <div class="event-description">{{ eventData.description }}</div>
      </div>
    </div>
    <!-- Se non c'è evento, il componente non renderizza nulla -->
  </template>
  
  <script>
  export default {
    name: "TodayEvent",
    data() {
      return {
        eventData: null,
      };
    },
    computed: {
      dayNumber() {
        if (!this.eventData || !this.eventData.event_date) return "";
        const date = new Date(this.eventData.event_date + "T00:00:00");
        return date.getDate();
      },
      monthName() {
        if (!this.eventData || !this.eventData.event_date) return "";
        const date = new Date(this.eventData.event_date + "T00:00:00");
        return date.toLocaleString('it-IT', { month: 'long' });
      }
    },
    methods: {
      async fetchTodayEvent() {
        try {
          const response = await fetch("https://api.bitcoinbeer.events/api/today_event.php");
          const data = await response.json();
          // Se l'API restituisce un array con almeno un evento...
          if (Array.isArray(data) && data.length > 0) {
            // Ottieni la data locale di oggi in formato YYYY-MM-DD
            const todayStr = new Date().toISOString().slice(0, 10);
            // Se il primo evento corrisponde alla data odierna, assegnalo, altrimenti null
            if (data[0].event_date === todayStr) {
              this.eventData = data[0];
            } else {
              this.eventData = null;
            }
          } else {
            this.eventData = null;
          }
        } catch (error) {
          console.error("Errore nel recupero dell'evento:", error);
          this.eventData = null;
        }
      }
    },
    mounted() {
      this.fetchTodayEvent();
    }
  };
  </script>
  
  <style scoped>
  /* Box principale con bordo bianco, sfondo trasparente */
  .event-container {
    display: flex;
    border: 1px solid #fff;
    background: transparent;
    width: 400px;
    margin: 1rem auto;
  }
  
  /* Box sinistro: sfondo bianco con numero in nero */
  .event-left {
    background: #fff;
    color: #000;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .event-day {
    font-size: 2.5rem;
    font-weight: bold;
  }
  
  /* Box destro: trasparente con testo bianco */
  .event-right {
    background: transparent;
    color: #fff;
    padding: 16px;
    flex: 1;
  }
  
  .event-month {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .event-description {
    font-size: 1rem;
    line-height: 1.4;
  }
  </style>
  