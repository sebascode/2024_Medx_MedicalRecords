CREATE TABLE Paciente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rut TEXT NOT NULL,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    telefono TEXT,
    email TEXT,
    direccion TEXT,
    ciudad TEXT,
    comuna TEXT,
    pais TEXT,
    created_at DATE DEFAULT (datetime('now')),
    updated_at DATE,
    deleted_at DATE
);
CREATE UNIQUE INDEX idx_paciente_rut ON Paciente(rut);

CREATE TABLE ConsultaMedica (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paciente_id INTEGER NOT NULL,
    fecha DATE NOT NULL,
    motivo TEXT NOT NULL,
    diagnostico TEXT,
    tratamiento TEXT,
    observaciones TEXT,
    created_at DATE DEFAULT (datetime('now')),
    updated_at DATE,
    deleted_at DATE,
    FOREIGN KEY (paciente_id) REFERENCES Paciente(id)
);
CREATE INDEX idx_consultamedica_paciente_id ON ConsultaMedica(paciente_id);
