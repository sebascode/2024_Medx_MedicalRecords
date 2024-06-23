<script lang="ts">
    import Ellipsis from "lucide-svelte/icons/ellipsis";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
    import { type IPaciente, Paciente } from "$lib/types/Paciente";
    import { ask, message } from "@tauri-apps/plugin-dialog";
    import { currentPaciente } from "$lib/stores/pacienteStore";
    import { goto } from "$app/navigation";
    import { deletePatientById } from "$lib/services/pacienteService";
    import Database from "@tauri-apps/plugin-sql";

    export let obj: Paciente;
    export let id: string;
    export let db: Database;

    function fnEditar(e: Event) {
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
        const _id = obj.id || 0;
        ask(
            `¿Está seguro de eliminar el paciente ${obj.nombre} ${obj.apellido}?`,
            {
                title: "Eliminar Paciente",
                kind: "warning",
            },
        ).then(async (ev) => {
            if (!ev) return;
            await deletePatientById(db, _id)
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
                    }
                });
        });
    }
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
        <Button
            variant="ghost"
            builders={[builder]}
            size="icon"
            class="relative h-8 w-8 p-0"
        >
            <span class="sr-only">Menu</span>
            <Ellipsis class="h-4 w-4" />
        </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Group>
            <DropdownMenu.Label>Acciones</DropdownMenu.Label>
            <DropdownMenu.Item
                on:click={() => navigator.clipboard.writeText(id)}
            >
                Copiar ID
            </DropdownMenu.Item>
            <DropdownMenu.Item
                on:click={() =>
                    navigator.clipboard.writeText(obj.telefono || "")}
            >
                Copiar Teléfono
            </DropdownMenu.Item>
            <DropdownMenu.Item
                on:click={() => navigator.clipboard.writeText(obj.rut)}
            >
                Copiar Rut
            </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item on:click={fnEditar}>Ver/Editar</DropdownMenu.Item>
        <DropdownMenu.Item on:click={fnEliminar}>Eliminar</DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>
