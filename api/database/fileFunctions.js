import { bucket } from "./firebaseConnect.js";

export async function deleteFile(name) {
    await bucket.file(name).delete();
}