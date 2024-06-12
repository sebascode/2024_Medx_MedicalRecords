import { z } from "zod";
export const formSchema = z.object({
  rut: z.string().min(9).max(10),
  nombre: z.string().min(2).max(50),
  apellido: z.string().min(2).max(50),
  fecha_nacimiento: z.string().date(),
  /*telefono: z.string().min(2).max(50),
  email: z.string().email(),
  direccion: z.string().min(2).max(50),
  comuna: z.string().min(2).max(50),
  ciudad: z.string().min(2).max(50),
  pais: z.string().min(2).max(50),
  */
});

export type FormSchema = typeof formSchema;
