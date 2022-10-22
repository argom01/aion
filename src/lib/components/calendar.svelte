<script lang="ts">
    import CalendarCell from "./calendarCell.svelte";
    import DayDetail from "./dayDetail.svelte";
    import { selectedDay, selectedMonthData, selectedMonth } from "$lib/stores/calendarStore";
</script>

{#await $selectedMonthData}
    <p>Loading</p>
{:then days}
    <div class="calendar-board" id={`calendar-board_${$selectedMonth.getMonth()}`}>
        {#each Object.entries(days) as [day, events]}
            <CalendarCell
                day={parseInt(day)}
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
