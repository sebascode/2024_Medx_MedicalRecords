import { writable } from "svelte/store";
import { Paciente } from "$lib/types/Paciente";

export const currentPaciente = writable(new Paciente());
