import { Valid } from "./Valid";

export interface IPaciente {
  id?: number;
  rut: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: Date;
  telefono?: string;
  email?: string;
  direccion?: string;
  comuna?: string;
  ciudad?: string;
  pais?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export class Paciente implements IPaciente {
  id?: number;
  rut: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: Date;
  telefono?: string;
  email?: string;
  direccion?: string;
  comuna?: string;
  ciudad?: string;
  pais?: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;

  constructor(obj?: IPaciente) {
    this.id = obj?.id;
    this.rut = obj?.rut ?? "";
    this.nombre = obj?.nombre ?? "";
    this.apellido = obj?.apellido ?? "";
    this.fecha_nacimiento = obj?.fecha_nacimiento
      ? new Date(obj?.fecha_nacimiento)
      : new Date();
    this.telefono = obj?.telefono;
    this.email = obj?.email;
    this.direccion = obj?.direccion;
    this.comuna = obj?.comuna;
    this.ciudad = obj?.ciudad;
    this.pais = obj?.pais;
    this.created_at = obj?.created_at ?? new Date();
    this.updated_at = obj?.updated_at ?? undefined;
    this.deleted_at = obj?.deleted_at ?? undefined;
  }

  private _edad: number = 0;
  private edad() {
    console.log("entró a edad");
    if (this._edad != 0) return this._edad;
    const today = new Date();
    let age = today.getFullYear() - this.fecha_nacimiento.getFullYear();
    const monthDifference = today.getMonth() - this.fecha_nacimiento.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < this.fecha_nacimiento.getDate())
    ) {
      age--;
    }
    this._edad = age;
    return this._edad;
  }
  get edadPaciente(): number {
    return this.edad();
  }
  get fecha_nacimientoStr(): string {
    return this.fecha_nacimiento.toISOString().split("T")[0];
  }
  set fecha_nacimientoStr(fecha: string) {
    this.fecha_nacimiento = new Date(fecha);
  }

  get nombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`;
  }

  public get isValid(): Valid {
    let field;
    const minLetters = 3;
    const strMsg = ` es obligatorio y debe tener ${minLetters} o más letras.`;
    if (!this.validaRut()) {
      return new Valid({
        result: false,
        message:
          "Rut no cumple con la validación y/o formato requerido. Ej.: 12345678-9",
      });
    }
    if (!this.nombre || this.nombre.length < minLetters) {
      field = "Nombre";
      return new Valid({
        result: false,
        message: field + strMsg,
      });
    }
    if (!this.apellido || this.apellido.length < minLetters) {
      field = "Apellido";
      return new Valid({
        result: false,
        message: field + strMsg,
      });
    }
    return new Valid({
      result: true,
      message: "Paciente válido.",
    });
  }

  private validaRut(): boolean {
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(this.rut)) return false;
    let tmp = this.rut.toLowerCase().split("-");
    let digv = tmp[1];
    let rut = tmp[0];
    return this.dv(rut) === digv;
  }

  private dv(T: string): string {
    let M = 0,
      S = 1;
    for (; T; T = Math.floor(T / 10)) S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
    return S ? String(S - 1) : "k";
  }
}
