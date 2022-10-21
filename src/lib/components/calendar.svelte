<script lang="ts">
    import CalendarCell from "./calendarCell.svelte";
    import DayDetail from "./dayDetail.svelte";
    import { selectedDay, selectedMonth } from "$lib/stores/calendarStore"

    export let month: number;
    export let year: number;
</script>

{#await $selectedMonth}
    <p>Loading</p>
{:then days}
    <div class="calendar-board" id={`calendar-board_${month}`}>
        {#each Object.entries(days) as [day, events]}
            <CalendarCell
                {day}
                busy={events.length !== 0}
                id={`cal-cell_${day}`}
            />
        {/each}
    </div>
    {#if $selectedDay}
        <DayDetail events={days[$selectedDay]} />
    {/if}
{:catch error}
    <p>{error}</p>
{/await}
