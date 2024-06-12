<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import Database from "@tauri-apps/plugin-sql";
    import { ask, message } from "@tauri-apps/plugin-dialog";
    import {
        getAllPatients,
        deletePatientById,
    } from "$lib/services/pacienteService";
    import { type IPaciente, Paciente } from "$lib/types/Paciente";
    import { currentPaciente } from "$lib/stores/pacienteStore";
    import { goto } from "$app/navigation";

    let patients: Array<Paciente> = [];
    currentPaciente.set(new Paciente());
    async function init() {
        try {
            const db: Database = await Database.load(
                "sqlite:medx_collection.db",
            );
            getAllPatients(db).then((result) => {
                patients = [];
                console.log({ result });
                result.forEach((p: IPaciente) => {
                    console.log({ p });
                    patients.push(new Paciente(p));
                });
            });
        } catch (e) {
            console.error(e);
        }
    }

    function fnEditar(e: Event) {
        const btn = e.target as HTMLButtonElement;
        const idStr = btn.dataset.id ?? "";
        const obj = patients.find((p) => p.id === Number.parseInt(idStr));
        if (obj) {
            currentPaciente.set(obj);
            goto("/paciente/new");
        } else {
            message("No se encontró el paciente", {
                title: "Error",
                kind: "error",
            });
        }
    }

    async function fnEliminar(e: Event) {
        const btn = e.target as HTMLButtonElement;
        const idStr = btn.dataset.id ?? "";
        const id = Number.parseInt(idStr);
        const db: Database = await Database.load("sqlite:medx_collection.db");

        ask("¿Está seguro de eliminar el paciente?", {
            title: "Eliminar Paciente",
            kind: "warning",
        }).then(async (ev) => {
            if (!ev) return;
            await deletePatientById(db, id)
                .catch((e) => {
                    console.error(e);
                    message(
                        "Ocurrió un error al eliminar paciente. Mensaje: " +
                            e.message,
                        {
                            title: "Paciente Eliminado",
                            kind: "error",
                        },
                    );
                })
                .then((result) => {
                    if (result) {
                        message("Paciente eliminado correctamente.", {
                            title: "Paciente Eliminado",
                            kind: "info",
                        });
                        init();
                    }
                });
        });
    }

    init();
</script>

<Table.Root>
    <Table.Header>
        <Table.Row>
            <Table.Head class="w-[50px]">#</Table.Head>
            <Table.Head class="w-[130px]">Rut</Table.Head>
            <Table.Head>Nombre Completo</Table.Head>
            <Table.Head>Edad</Table.Head>
            <Table.Head class="text-right">Acciones</Table.Head>
        </Table.Row>
    </Table.Header>
    <Table.Body>
        {#if patients.length === 0}
            <Table.Row>
                <Table.Cell colspan="5" class="text-center"
                    >No hay pacientes</Table.Cell
                >
            </Table.Row>
        {/if}
        {#each patients as patient, i (i)}
            <Table.Row>
                <Table.Cell class="font-small">{i + 1}</Table.Cell>
                <Table.Cell class="font-medium">{patient.rut}</Table.Cell>
                <Table.Cell
                    >{patient.nombre + " " + patient.apellido}</Table.Cell
                >
                <Table.Cell>{patient.edadPaciente}</Table.Cell>
                <Table.Cell class="text-right">
                    <button
                        class="btn btn-warning"
                        data-rut={patient.rut}
                        data-id={patient.id}
                        on:click={fnEditar}>Editar</button
                    >
                    <button
                        class="btn btn-danger"
                        data-rut={patient.rut}
                        data-id={patient.id}
                        on:click={fnEliminar}>Eliminar</button
                    >
                </Table.Cell>
            </Table.Row>
        {/each}
    </Table.Body>
</Table.Root>
