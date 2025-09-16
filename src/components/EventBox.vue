<template>
  <div class="event-container">
    <!-- Box sinistro: sfondo bianco con numero del giorno -->
    <div class="event-left">
      <div class="event-day">{{ formattedDay }}</div>
    </div>
    <!-- Box destro: area trasparente con mese, titolo (opzionale) e descrizione -->
    <div class="event-right">
      <div class="event-month">{{ formattedMonth }}</div>
      <!-- Mostra il titolo se presente -->
      <div v-if="title" class="event-title">{{ title }}</div>
      <div class="event-description">{{ description }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EventBox",
  props: {
    event_date: String,
    title: String,
    description: String
  },
  computed: {
    formattedDay() {
      return this.event_date ? new Date(this.event_date).getDate() : "";
    },
    formattedMonth() {
      const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
      return this.event_date ? months[new Date(this.event_date).getMonth()] : "";
    }
  }
};
</script>

<style scoped>
.event-container {
  display: flex;
  border: 1px solid #fff;
  background: transparent;
  width: 400px;
  margin: 1rem auto;
}

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
  text-transform: uppercase;
}

.event-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 4px;
}

.event-description {
  font-size: 1rem;
  line-height: 1.4;
}
</style>
