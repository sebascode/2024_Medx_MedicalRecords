<script lang="ts">
    import { Button } from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import Database from "@tauri-apps/plugin-sql";
    import { type IPaciente, Paciente } from "$lib/types/Paciente";
    import { upsertPatient } from "$lib/services/pacienteService";
    import { message as mensajeria } from "@tauri-apps/plugin-dialog";
    import { currentPaciente } from "$lib/stores/pacienteStore";

    const formSchema: Array<string> = [];
    let obj: Paciente;

    currentPaciente.subscribe((value: IPaciente) => {
        obj = new Paciente(value);
    });

    const init = async () => {
        Object.getOwnPropertyNames(new Paciente()).forEach((field) => {
            if (
                !(field == "id") &&
                !(field == "_edad") &&
                !field.includes("_at")
            ) {
                formSchema.push(field);
            }
        });
    };

    init();

    async function submit(e: Event) {
        const formEl = e.target as HTMLFormElement;
        const db: Database = await Database.load("sqlite:medx_collection.db");
        const { result, message } = obj.isValid;
        if (!result) {
            await mensajeria(message, {
                title: "Validación",
                kind: "error",
            });
            return;
        }

        await upsertPatient(db, obj)
            .then(async (result) => {
                if (result) {
                    await mensajeria(
                        "Datos guardados correctamente, rut: " + obj.rut,
                        {
                            title: "Guardado",
                            kind: "info",
                        },
                    );
                    formEl.reset();
                    currentPaciente.set(new Paciente());
                }
            })
            .catch((e) => {
                console.error("error::: " + e);
                let msg = e || e.message;
                if (e.includes("code: 2067")) msg = "El paciente ya existe";
                mensajeria(
                    "Ocurrió un error al guardar paciente. Mensaje: " + msg,
                    {
                        title: "Error",
                        kind: "error",
                    },
                );
            });
    }

    function fnLimpiar(ev: Event) {
        ev.preventDefault();
        currentPaciente.set(new Paciente());
    }
</script>

<h1>{obj.id != null ? "Actualización" : "Creación"} de Paciente</h1>
<div class="form">
    <form on:submit|preventDefault={submit} method="POST">
        {#each formSchema as field}
            <label for="txt_{field}" style="text-transform: capitalize;"
                >{field.replace("_", " ")}</label
            >
            {#if field.includes("fecha")}
                <Input
                    type="date"
                    required={field === "fecha_nacimiento"}
                    id="txt_{field}"
                    bind:value={obj["fecha_nacimientoStr"]}
                />
            {:else}
                <Input
                    type="text"
                    required={field === "rut" ||
                        field === "nombre" ||
                        field === "apellido"}
                    id="txt_{field}"
                    bind:value={obj[field]}
                />
            {/if}
        {/each}
        <br />
        <Button>Guardar</Button>
        <Button on:click={fnLimpiar}>Limpiar</Button>
    </form>
</div>
