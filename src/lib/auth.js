import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET,

    // REQUIRED FOR LINKING ACCOUNTS

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        },
    },

    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    database: mongodbAdapter(db, {
        // Optional: if you don't provide a client, database transactions won't be enabled.
        client
    }),

    // ADD THIS USER SECTION HERE

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "client",
                input: true, // ALLOWS CLIENT SDK TO WRITE TO THIS FIELD
            },
            isBlocked: {
                defaultValue: false
            },
        },
    },

});