<script lang="ts">
    import type { TEventResponse } from "src/types/event.types";

    export let events: Array<TEventResponse> = [];
</script>

{#each events as event}
    <span>{event.title}</span>
{/each}
