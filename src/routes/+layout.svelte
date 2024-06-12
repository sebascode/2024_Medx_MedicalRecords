<script lang="ts">
    import "../app.pcss";
    import * as Menubar from "$lib/components/ui/menubar";
    import Sun from "$lib/icons/Sun.svelte";
    import Moon from "$lib/icons/Moon.svelte";
    import { ModeWatcher, toggleMode } from "mode-watcher";
    import { Button } from "$lib/components/ui/button/index.js";
</script>

<ModeWatcher />
<Menubar.Root>
    <Menubar.Menu>
        <Menubar.Item data-highlighted="true" href="/">Inicio</Menubar.Item>
        <Menubar.Trigger>Pacientes</Menubar.Trigger>
        <Menubar.Content>
            <Menubar.Item href="/paciente/">
                Listar
                <Menubar.Shortcut>⌘L</Menubar.Shortcut>
            </Menubar.Item>
            <Menubar.Item href="/paciente/new">Nuevo</Menubar.Item>
        </Menubar.Content>
        <Menubar.Item>
            <Button on:click={toggleMode} variant="outline" size="icon">
                <Sun
                    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <Moon
                    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
                <span class="sr-only">Toggle theme</span>
            </Button>
        </Menubar.Item>
    </Menubar.Menu>
</Menubar.Root>

<div class="container">
    <br />
    <slot />
</div>
