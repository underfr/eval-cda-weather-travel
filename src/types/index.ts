export interface GeoCity {
    id: number
    name: string
    latitude: string
    longitude: string
    country: string
    country_code: number
}

export interface WeatherData {
    temperature: number
    windSpeed: number
    weatherCode: string
    updatedAt: string
}

export interface Trip {
    id?: string
    cityName: string
    latitude: string
    longitude: string
    country: string
    startDate: string
    notes: string
    createdAt: string
}