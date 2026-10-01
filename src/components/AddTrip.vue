<script setup lang="ts">
import {ref, watch} from "vue";
import type {GeoCity, Trip} from "../types";

const props = defineProps<{
  searchResults: GeoCity[]
  isSubmitting: boolean
}>()

const city = ref('')
const notes = ref('')
const date = ref('')

const emit = defineEmits<{
  search: [query: string]
  addTrip: [trip: Omit<Trip, 'id'>]
}>()
const selectedCity = ref<GeoCity | null>(null)
function handleSubmit() {
  if (!selectedCity.value) return
  emit('addTrip', {
    cityName: selectedCity.value.name,
    latitude: selectedCity.value.latitude,
    longitude: selectedCity.value.longitude,
    country: selectedCity.value.country,
    startDate: date.value,
    notes: notes.value,
    createdAt: new Date().toISOString(),
  })
}
watch(city, (value)=>{
  if (value === selectedCity.value?.name) return
  selectedCity.value = null
  if (value.trim().length >= 2) emit('search', value.trim())
})

function selectCity(c: GeoCity){
  selectedCity.value = c
  city.value = c.name
}
</script>

<template>
  <div class="flex flex-col">
    <form @submit.prevent="handleSubmit()" class="flex flex-col">
      <label for="city">Ville</label>
      <input type="text" class="input input-primary" name="city" id="city" v-model="city" >
      <ul v-if="searchResults.length && !selectedCity" class="menu bg-base-100 rounded-box shadow">
        <li v-for="c in searchResults" :key="c.id">
          <a @click="selectCity(c)">{{ c.name }}, {{ c.country }}</a>
        </li>
      </ul>
      <label for="date">Date</label>
      <input type="date" name="date" id="date" class="input input-primary" v-model="date" required>
      <label for="notes">Notes</label>
      <textarea name="notes" id="notes" cols="30" rows="10" class="textarea" v-model="notes"></textarea>
      <button class="btn btn-primary" :disabled="isSubmitting">Ajouter</button>
    </form>

  </div>
</template>

<style scoped>

</style>