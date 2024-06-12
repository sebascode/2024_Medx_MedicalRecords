import Database from "@tauri-apps/plugin-sql";

// sqlite. The path is relative to `tauri::api::path::BaseDirectory::App`.
console.log(":::::: Intiation DB loading process ::::::");
const db = await Database.load("sqlite:medx_collection.db");

console.log({ db });
console.log(":::::: DB loading process COMPLETE ::::::");
export default db;
