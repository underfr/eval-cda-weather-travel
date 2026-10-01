<script setup lang="ts">

import AddTrip from "../components/AddTrip.vue";
import {onMounted, onUnmounted, ref} from "vue";
import {tripService} from "../services/TripService.ts";
import TripCard from "../components/TripCard.vue";
import type {GeoCity, Trip, WeatherData} from "../types";
import {auth} from "../services/firebase.ts";
import {weatherService} from "../services/WeatherService.ts";
import {onAuthStateChanged, type User, type Unsubscribe} from "firebase/auth";

const user = ref<User | null>(null)
const trips = ref<Trip[]>([])
const searchResults = ref<GeoCity[]>([])
const weathers = ref<Record<string,WeatherData>>({})
const isSubmitting = ref(false)
let timeout: ReturnType<typeof setTimeout> | undefined
let unsubscribe: Unsubscribe | undefined
const onSubmit = async (trip: Omit<Trip, 'id'>)=>{
  if (!user.value) return
  isSubmitting.value = true
  try {
    await tripService.addTrip(user.value.uid, trip)
    await loadTrips()
  } catch (err){
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

const onSearch = (query:string)=>{
  clearTimeout(timeout)
  timeout = setTimeout(async ()=>{
    try{
      const result = await weatherService.searchCities(query)
      searchResults.value = result?.results ?? []
    } catch (err){
      console.error(err)
      searchResults.value = []
    }
  }, 500)
}

const onDelete = async (tripId: string)=>{
  if (!user.value) return
  try {
    await tripService.deleteTrip(user.value.uid, tripId)
    await loadTrips()
  } catch (err){
    console.error(err)
  }
}

onMounted(()=>{
  unsubscribe = onAuthStateChanged(auth, async (u) => {
    user.value = u
    if (u) await loadTrips()
  })
})

onUnmounted(()=> unsubscribe?.())

const loadTrips = async ()=>{
  if (!user.value) return
  try {
    trips.value = await tripService.getUserTrips(user.value.uid)
  } catch (err){
    console.error(err)
    trips.value = []
  }
  for (const trip of trips.value) {
    try {
      weathers.value[trip.id!] = await weatherService.getWeather(trip.latitude, trip.longitude)
    } catch (err) {
      console.error(err)
      const cached = weatherService.getCachedWeather(trip.latitude, trip.longitude)
      if (cached) weathers.value[trip.id!] = cached
    }
  }
}

</script>

<template>
<AddTrip :is-submitting="isSubmitting" :search-results="searchResults" @add-trip="onSubmit" @search="onSearch"/>
  <p v-if="!trips.length" class="opacity-60 mt-6">Aucun voyage pour l'instant.</p>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
    <TripCard v-for="trip in trips" :key="trip.id" :trip="trip"
              :weather="weathers[trip.id!]" @delete="onDelete" />
  </div>
</template>

<style scoped>

</style>