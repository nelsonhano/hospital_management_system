'use server'

import { ID, Query } from "node-appwrite"
import { APPOINTMENTS_COLLECTION_ID, database, DATABASE_ID } from "../appwrite.config"
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";

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
};

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
};

export const getRecentAppointmentList = async () => {
    try {
        const appointments = await database.listDocuments(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        );

        const initialCount = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelled: 0
        };

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === 'scheduled') {
                acc.scheduledCount += 1
            } if (appointment.status === 'pending') {
                acc.pendingCount += 1
            } if (appointment.status === 'cancelled') {
                acc.cancelled += 1
            };

            return acc
        }, initialCount);

        const data = {
            totalDocs: appointments.total,
            ...counts,
            documents: appointments.documents
        };

        return parseStringify(data)
    } catch (error) {
        console.log(error);
        
    }
}