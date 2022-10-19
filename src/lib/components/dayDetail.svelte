<script lang="ts">
    import { currentDay, isDisplayed } from "$lib/stores/currentDay";
    export let events: any = [];

    let currentEvents: any = [];
    let displayed = $isDisplayed
    if (displayed) {
        currentEvents = events[$currentDay - 1][1];
        console.log(currentEvents)
    }
</script>

{#if $isDisplayed}
    {#each currentEvents as event}
        <div>
            <span>{event.title}</span>
        </div>
    {/each}
{/if}
