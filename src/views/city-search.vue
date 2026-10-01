<script setup lang="ts">
import { weatherService } from "../services/WeatherService.ts";
import { ref, watch } from "vue";
import type {GeoCity, WeatherData} from "../types";

const inputCity = ref('')
const suggestions = ref<GeoCity[]>([])
const selectedCity = ref<GeoCity | null>(null)
const weather = ref<WeatherData | null>(null)
const errorMessage = ref('')
const loadingWeather = ref(false)

let timeout: ReturnType<typeof setTimeout> | undefined
let skipNextSearch = false
let requestId = 0

watch(inputCity, (value) => {
  if (skipNextSearch) {
    skipNextSearch = false
    return
  }

  clearTimeout(timeout)
  selectedCity.value = null
  weather.value = null
  errorMessage.value = ''

  const name = value.trim()
  if (name.length < 2) {
    suggestions.value = []
    return
  }

  timeout = setTimeout(() => searchSuggestions(name), 300)
})

async function searchSuggestions(name: string) {
  const currentId = ++requestId
  try {
    const result = await weatherService.searchCities(name)
    if (currentId !== requestId) return

    suggestions.value = result?.results ?? []
    if (suggestions.value.length === 0) {
      errorMessage.value = 'Aucune ville ne correspond à ce nom'
    }
  } catch (err) {
    console.error(err)
    suggestions.value = []
    errorMessage.value = 'Erreur lors de la recherche'
  }
}

async function selectCity(location: GeoCity) {
  skipNextSearch = true
  inputCity.value = location.name
  suggestions.value = []
  selectedCity.value = location

  loadingWeather.value = true
  try {
    weather.value = await weatherService.getWeather(location.latitude, location.longitude)
  } catch (err) {
    console.error(err)
    weather.value = weatherService.getCachedWeather(location.latitude, location.longitude)
    if (!weather.value) errorMessage.value = 'Erreur lors de la récupération de la météo'
  } finally {
    loadingWeather.value = false
  }
}
</script>

<template>
    <div class="max-w-md mx-auto p-4 space-y-4">
      <fieldset class="fieldset relative">
        <legend class="fieldset-legend">Entrez le nom de la ville</legend>

        <label class="input input-primary w-full">
          <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
              id="city-name"
              type="search"
              class="grow"
              placeholder="Toulouse, Lyon, Paris…"
              autocomplete="off"
              v-model="inputCity"
          >
        </label>

        <ul
            v-if="suggestions.length"
            class="menu bg-base-100 rounded-box shadow-lg border border-base-300
               absolute top-full left-0 z-10 w-full mt-1 max-h-72 overflow-y-auto flex-nowrap"
        >
          <li v-for="s in suggestions" :key="s.id">
            <a @click="selectCity(s)" class="flex flex-col items-start gap-0">
              <span class="font-medium">{{ s.name }}</span>
            </a>
          </li>
        </ul>
      </fieldset>

      <div v-if="errorMessage" role="alert" class="alert alert-error alert-soft">
        <span>{{ errorMessage }}</span>
      </div>

      <div v-else-if="loadingWeather" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div v-else-if="selectedCity && weather" class="card bg-base-100 shadow-md border border-base-300">
        <div class="card-body">
          <div>
            <h2 class="card-title text-2xl">{{ selectedCity.name }}</h2>
          </div>

          <div class="stats stats-vertical sm:stats-horizontal bg-base-200 mt-2">
            <div class="stat">
              <div class="stat-title">Température</div>
              <div class="stat-value text-primary">
                {{ weather.temperature }} °C
              </div>
            </div>

            <div class="stat">
              <div class="stat-title">Vent</div>
              <div class="stat-value text-2xl">
                {{ weather.windSpeed }}
                <span class="text-base font-normal">km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>