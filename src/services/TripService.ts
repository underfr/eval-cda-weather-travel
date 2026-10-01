import { database } from "./firebase.ts"
import {ref, get, push, set, remove} from "firebase/database";
import type {Trip} from "../types";
class TripService {

    async getUserTrips(userId: string){
        const snapshot = await get(ref(database, `users/${userId}/trips`))
        if (!snapshot.exists()) return []
        const data = snapshot.val() as Record<string, Omit<Trip, 'id'>>
        return Object.entries(data).map(([id,trip])=>({id, ...trip}))
    }

    async addTrip(userId:string, trip: Omit<Trip, 'id'>){
        const newRef = push(ref(database, `users/${userId}/trips`))
        await set(newRef, trip)
        return newRef.key
    }

    async deleteTrip(userId:string, tripId:string){
        await remove(ref(database, `users/${userId}/trips/${tripId}`))
    }

}

export const tripService = new TripService()