import type {WeatherData} from "../types";

class WeatherService {

    async searchCities(query:string){
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=fr`)
        if (!res.ok) throw new Error(`${res.status} sur ${query}`)
        return res.json()
    }

    async getWeather(lat: string, lng: string){
        const res=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`)
        if (!res.ok) throw new Error(`${res.status}`)
        const json = await res.json()
        const data: WeatherData = {
            temperature: json.current_weather.temperature,
            windSpeed: json.current_weather.windspeed,
            weatherCode: String(json.current_weather.weathercode),
            updatedAt: json.current_weather.time
        }
        localStorage.setItem(`cached-weather-${lat}-${lng}`, JSON.stringify(data))
        return data
    }

    getCachedWeather(lat:string,lng:string):WeatherData|null{
        const raw = localStorage.getItem(`cached-weather-${lat}-${lng}`)
        if (!raw) return null
        try {
            return JSON.parse(raw)
        } catch {
            return null
        }
    }
}

export const weatherService = new WeatherService()