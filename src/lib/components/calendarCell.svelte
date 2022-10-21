<script lang="ts">
    import { selectedDay } from "$lib/stores/calendarStore"
    export let day: number;
    export let busy: boolean = false;
    export let id: string;

    function toggleDay() {
        if ($selectedDay === day) {
            selectedDay.selectDay(null);
        } else {
            selectedDay.selectDay(day);
        }
    }
</script>

<div on:click={toggleDay} class="cal-cell" {id}>
    <p>{day}</p>
    {#if busy}
        <span>Event</span>
    {/if}
</div>
