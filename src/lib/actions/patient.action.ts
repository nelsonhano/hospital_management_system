'use server';

import { ID, Query } from "node-appwrite";
import { APPOINTMENTS_COLLECTION_ID, BUCKET_ID, database, DATABASE_ID, ENDPOINT_ID, PATIENTS_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from 'node-appwrite/file';
import { revalidatePath } from "next/cache";


export const createUser = async ({ email, phone, name }: CreateUserParams) => {
    try {
        const newUser = await users.create(ID.unique(), email, phone, undefined, name);

        return parseStringify(newUser)
    } catch (error: any) {
        console.log(error);
        
        if (error && error?.code === 409) {
            const documents = await users.list([
                Query.equal('email', [email])
            ]);

            return documents.users[0];
        }
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);

        return parseStringify(user);
    } catch (error) {
        console.log(error);
        
    }
};

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    
    try {
        let file;

        if (identificationDocument) {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string,
            );

            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
        };

        const newPatient = await database.createDocument(
            DATABASE_ID!,
            PATIENTS_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${ENDPOINT_ID}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient,
            },
        );

        return parseStringify(newPatient);
    } catch (error) {
        console.log(error);
        
    }
};

export const getPatient = async (userId: string) => {
    try {
        const patient = database.listDocuments(
            DATABASE_ID!,
            PATIENTS_COLLECTION_ID!,
            [Query.equal('userId', userId)]
        );

        return parseStringify((await patient).documents[0]);
    } catch (error) {
        console.log(error);
    }
};

export const updateAppointment = async ({ 
    appointmentId, 
    appointment, 
}:UpdateAppointmentParams
) => {
    try {
        const updatedAppointment = await database.updateDocument(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            appointmentId,
            appointment
        );

        if (!updatedAppointment) {
            throw new Error("Appointment not found");
        };

        //TODO SMS notification

        revalidatePath("/admin");

            return parseStringify({updateAppointment});
    } catch (error) {
        console.log(error);
        
    }
}