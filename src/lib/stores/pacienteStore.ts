import { writable } from "svelte/store";
import { Paciente } from "$lib/types/paciente";

export const currentPaciente = writable(new Paciente());
