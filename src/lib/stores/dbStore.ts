import { readable, type Readable } from "svelte/store";
import Database from "@tauri-apps/plugin-sql";

// Función asíncrona para cargar la base de datos
async function loadDatabase(): Promise<Database> {
  const db = await Database.load("sqlite:medx_collection.db");
  return db;
}

// Crear el store legible con tipo específico
export const dbGlobal: Readable<Database | null> = readable<Database | null>(
  null,
  (set) => {
    // Cargar la base de datos y actualizar el store
    loadDatabase()
      .then((dbInstance) => {
        set(dbInstance);
      })
      .catch((error) => {
        console.error("Error loading database:", error);
        set(null);
      });

    // Opción de limpieza
    return () => {};
  },
);
