'use server'

import { ID } from "node-appwrite"
import { APPOINTMENTS_COLLECTION_ID, database, DATABASE_ID } from "../appwrite.config"
import { parseStringify } from "../utils";

export const createAppointment = async (appointmentData: CreateAppointmentParams) => {
    try {
        const createAppointment = await database.createDocument(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            ID.unique(),
            appointmentData
        );
        
        return parseStringify(createAppointment);
    } catch (error) {
        console.log(error);
        
    }
}

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await database.getDocument(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            appointmentId
        );

        return parseStringify(appointment);
    } catch (error) {
        console.log(error);
        
    }
}