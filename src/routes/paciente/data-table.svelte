<script lang="ts">
    import { Paciente } from "$lib/types/Paciente";
    import { currentPaciente } from "$lib/stores/pacienteStore";

    // data table
    import {
        createTable,
        Render,
        Subscribe,
        createRender,
    } from "svelte-headless-table";
    import { readable } from "svelte/store";
    import * as Table from "$lib/components/ui/table";
    import DataTableActions from "./data-table-actions.svelte";
    import {
        addPagination,
        addSortBy,
        addTableFilter,
        addHiddenColumns,
    } from "svelte-headless-table/plugins";
    import { Button } from "$lib/components/ui/button";
    import ArrowUpDown from "lucide-svelte/icons/arrow-up-down";
    import Database from "@tauri-apps/plugin-sql";
    import { Input } from "$lib/components/ui/input";
    import ChevronDown from "lucide-svelte/icons/chevron-down";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

    export let patients: Array<Paciente> = [];
    export let db: Database;
    currentPaciente.set(new Paciente());

    const table = createTable(readable(patients), {
        page: addPagination(),
        sort: addSortBy(),
        filter: addTableFilter({
            fn: ({ filterValue, value }) =>
                value.toLowerCase().includes(filterValue.toLowerCase()),
        }),
        hide: addHiddenColumns(),
    });
    const columns = table.createColumns([
        table.column({
            accessor: "rut",
            header: "Rut",
        }),
        table.column({
            accessor: "nombreCompleto",
            header: "Nombre",
        }),
        table.column({
            accessor: "email",
            header: "Email",
            plugins: {
                sort: {
                    disable: true,
                },
            },
        }),
        table.column({
            accessor: "telefono",
            header: "Teléfono",
            plugins: {
                sort: {
                    disable: true,
                },
                hide: {},
            },
        }),
        table.column({
            accessor: "edadPaciente",
            header: "Edad",
            plugins: {
                sort: {
                    disable: true,
                },
                filter: {
                    exclude: true,
                },
            },
        }),
        table.column({
            accessor: "created_at",
            header: "Creación",
            plugins: {
                sort: {
                    disable: true,
                },
                filter: {
                    exclude: true,
                },
            },
        }),
        table.column({
            accessor: ({ id }) => id,
            header: "",
            cell: ({ value }) => {
                return createRender(DataTableActions, {
                    id: value?.toString() || "",
                    obj: patients.find((p) => p.id === value) || new Paciente(),
                    db,
                });
            },
            plugins: {
                sort: {
                    disable: true,
                },
                filter: {
                    exclude: true,
                },
            },
        }),
    ]);
    const {
        headerRows,
        pageRows,
        tableAttrs,
        tableBodyAttrs,
        pluginStates,
        flatColumns,
    } = table.createViewModel(columns);

    const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
    const { filterValue } = pluginStates.filter;
    const { hiddenColumnIds } = pluginStates.hide;

    const ids = flatColumns.map((col) => col.id);
    let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

    $: $hiddenColumnIds = Object.entries(hideForId)
        .filter(([, hide]) => !hide)
        .map(([id]) => id);

    const hidableCols = [
        "edadPaciente",
        "rut",
        "telefono",
        "email",
        "created_at",
    ];
</script>

<div>
    <div class="flex items-center py-4">
        <Input
            class="max-w-sm"
            placeholder="Buscar"
            type="text"
            bind:value={$filterValue}
        />
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
                <Button variant="outline" class="ml-auto" builders={[builder]}>
                    Columnas <ChevronDown class="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {#each flatColumns as col}
                    {#if hidableCols.includes(col.id)}
                        <DropdownMenu.CheckboxItem
                            bind:checked={hideForId[col.id]}
                        >
                            {col.header}
                        </DropdownMenu.CheckboxItem>
                    {/if}
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div>
    <div class="rounded-md border">
        <Table.Root {...tableAttrs}>
            <Table.Header>
                {#each $headerRows as headerRow}
                    <Subscribe rowAttrs={headerRow.attrs()}>
                        <Table.Row>
                            {#each headerRow.cells as cell (cell.id)}
                                <Subscribe
                                    attrs={cell.attrs()}
                                    let:attrs
                                    props={cell.props()}
                                    let:props
                                >
                                    <Table.Head {...attrs}>
                                        {#if cell.id !== "email" && cell.id !== "" && cell.id !== "edadPaciente"}
                                            <Button
                                                variant="ghost"
                                                on:click={props.sort.toggle}
                                            >
                                                <Render of={cell.render()} />
                                                <ArrowUpDown
                                                    class={"ml-2 h-4 w-4"}
                                                />
                                            </Button>
                                        {:else}
                                            <Render of={cell.render()} />
                                        {/if}
                                    </Table.Head>
                                </Subscribe>
                            {/each}
                        </Table.Row>
                    </Subscribe>
                {/each}
            </Table.Header>
            <Table.Body {...$tableBodyAttrs}>
                {#each $pageRows as row (row.id)}
                    <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                        <Table.Row {...rowAttrs}>
                            {#each row.cells as cell (cell.id)}
                                <Subscribe attrs={cell.attrs()} let:attrs>
                                    <Table.Cell {...attrs}>
                                        <Render of={cell.render()} />
                                    </Table.Cell>
                                </Subscribe>
                            {/each}
                        </Table.Row>
                    </Subscribe>
                {/each}
            </Table.Body>
        </Table.Root>
    </div>
    <div class="flex items-center justify-end space-x-4 py-4">
        <Button
            variant="outline"
            size="sm"
            on:click={() => ($pageIndex = $pageIndex - 1)}
            disabled={!$hasPreviousPage}
        >
            &lt;
        </Button>
        <Button
            variant="outline"
            size="sm"
            disabled={!$hasNextPage}
            on:click={() => ($pageIndex = $pageIndex + 1)}>&gt;</Button
        >
    </div>
</div>
