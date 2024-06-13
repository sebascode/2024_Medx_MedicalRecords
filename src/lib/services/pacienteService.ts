import Database from "@tauri-apps/plugin-sql";
import type { Paciente } from "$lib/types/Paciente";

export async function getAllPatients(db: Database) {
  return await db.select<Array<Paciente>>("SELECT * FROM Paciente");
}

export function getPatientById(db: Database, id: number) {
  return db.select<Paciente>("SELECT * FROM Paciente WHERE id = ?", [id]);
}
export function getPatientByRut(db: Database, rut: string) {
  return db.select<Paciente>("SELECT * FROM Paciente WHERE rut = ?", [rut]);
}
export function getLikePatientByRut(db: Database, rut: string) {
  return db.select<Array<Paciente>>("SELECT * FROM Paciente WHERE rut LIKE ?", [
    rut,
  ]);
}

export function getPatientByPhone(db: Database, telefono: string) {
  return db.select<Array<Paciente>>(
    "SELECT * FROM Paciente WHERE telefono = ?",
    [telefono],
  );
}
export function getLikePatientByPhone(db: Database, telefono: string) {
  return db.select<Array<Paciente>>(
    "SELECT * FROM Paciente WHERE telefono LIKE ?",
    [telefono],
  );
}

export async function upsertPatient(db: Database, patient: Paciente) {
  if (patient.id != null) return await updatePatient(db, patient.id, patient);
  else return await createPatient(db, patient);
}

export function createPatient(db: Database, patient: Paciente) {
  const {
    rut,
    nombre,
    apellido,
    fecha_nacimiento,
    telefono,
    email,
    direccion,
    ciudad,
    comuna,
    pais,
  } = patient;
  return db.execute(
    `
        INSERT INTO Paciente (rut, nombre, apellido, fecha_nacimiento, telefono, email, direccion, ciudad, comuna, pais)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      rut,
      nombre,
      apellido,
      fecha_nacimiento,
      telefono,
      email,
      direccion,
      ciudad,
      comuna,
      pais,
    ],
  );
}

export function updatePatient(db: Database, id: number, patient: Paciente) {
  const {
    rut,
    nombre,
    apellido,
    fecha_nacimiento,
    telefono,
    email,
    direccion,
    ciudad,
    comuna,
    pais,
  } = patient;
  return db.execute(
    `
        UPDATE Paciente SET rut = ?, nombre = ?, apellido = ?, fecha_nacimiento = ?, telefono = ?, email = ?, direccion = ?, ciudad = ?, comuna = ?, pais = ?, updated_at = datetime('now')
        WHERE id = ?
    `,
    [
      rut,
      nombre,
      apellido,
      fecha_nacimiento,
      telefono,
      email,
      direccion,
      ciudad,
      comuna,
      pais,
      id,
    ],
  );
}

export function deletePatientById(db: Database, id: number) {
  return db.execute("DELETE FROM Paciente WHERE id = ?", [id]);
}
export function deletePatientByRut(db: Database, rut: number) {
  return db.execute("DELETE FROM Paciente WHERE rut = ?", [rut]);
}
