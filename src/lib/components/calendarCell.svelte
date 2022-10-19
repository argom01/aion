<script lang="ts">
    import { currentDay, isDisplayed } from "$lib/stores/currentDay";
    export let day: number;
    export let busy: boolean = false;
    export let id: string;

    function toggleDay() {
        if ($currentDay === day) {
            isDisplayed.set(!$isDisplayed);
            currentDay.set(0);
        } else {
            currentDay.update((day) => day);
        }
    }
</script>

<div on:click={toggleDay} class="cal-cell" {id}>
    <p>{day}</p>
    {#if busy}
        <span>Event</span>
    {/if}
</div>
