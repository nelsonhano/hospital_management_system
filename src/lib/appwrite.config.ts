import * as sdk from 'node-appwrite';

export const {
    PROJECT_ID,
    API_KEY,
    DATABASE_ID,
    PATIENTS_COLLECTION_ID,
    DOCTORS_COLLECTION_ID,
    APPOINTMENTS_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT_ID: ENDPOINT_ID
} = process.env


const client = new sdk.Client()
    client.setEndpoint(ENDPOINT_ID!)
    client.setProject(PROJECT_ID!)
    client.setKey(API_KEY!)



export const messaging = new sdk.Messaging(client);
export const database = new sdk.Databases(client);
export const storage =  new sdk.Storage(client);
export const account = new sdk.Account(client);
export const users = new sdk.Users(client)