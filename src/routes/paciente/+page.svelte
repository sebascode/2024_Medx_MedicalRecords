<script lang="ts">
    import DataTable from "./data-table.svelte";
    import { dbGlobal } from "$lib/stores/dbStore";
    import Database from "@tauri-apps/plugin-sql";
    import { getAllPatients } from "$lib/services/pacienteService";
    import { type IPaciente, Paciente } from "$lib/types/Paciente";

    const sleep = (time: number) =>
        new Promise((resolve) => setTimeout(resolve, time));
    let pacientes: Array<Paciente> = [];
    let db: Database;
    async function fetchPacientes() {
        dbGlobal.subscribe(async (val) => {
            if (val) {
                db = val;
                await getAllPatients(db).then((result) => {
                    pacientes = [];
                    result.forEach((p: IPaciente) => {
                        pacientes.push(new Paciente(p));
                    });
                });
            }
        });
        await sleep(10);
    }
</script>

<div class="container mx-auto py-10">
    <h1>Lista de Pacientes</h1>
    {#await fetchPacientes()}
        <p>Cargando...</p>
    {:then}
        <DataTable patients={pacientes} {db} />
    {/await}
</div>
