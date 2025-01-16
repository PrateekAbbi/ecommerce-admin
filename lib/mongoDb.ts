import mongoose from "mongoose";

let isConnected: boolean = false

export const connectToDB = async (): Promise<void> => {
    mongoose.set("strictQuery", true);

    if (isConnected) {
        console.log("MongoDB already connected");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI || "", {
            dbName: "Ecommerce_Admin",
        })

        isConnected = true;
        console.log("MongoDB Connected")
    } catch (error) {
        console.log("Error connecting to Database", error)
        return
    }
}