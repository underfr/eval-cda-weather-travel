<script setup lang="ts">
import type {Trip, WeatherData} from "../types";
const props = defineProps<{
  trip: Trip
  weather?: WeatherData
}>()

const emit = defineEmits<{delete:[id:string]}>()

</script>

<template>
  <div class="card bg-base-100 w-96 shadow-sm">
    <div class="card-body">
      <h2 class="card-title">{{ props.trip.cityName }} <span class="badge badge-primary">{{props.trip.startDate}}</span></h2>
      <div v-if="weather">
        <p>{{weather.temperature}} °C</p>
        <p>{{weather.windSpeed}} km/h</p>
      </div>
      <div v-else>
        <p>Météo indisponible</p>
      </div>
      <p>{{props.trip.notes}}</p>
      <div class="card-actions justify-end">
        <button class="btn btn-error" @click="emit('delete', trip.id!)">Supprimer</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>