<script lang="ts">
    import CalendarCell from "./calendarCell.svelte";
    import DayDetail from "./dayDetail.svelte";
    import EventForm from "./eventForm.svelte";
    import {
        selectedDayData,
        selectedMonthData,
        selectedMonth,
        selectedDay,
        eventFormDay
    } from "$lib/stores/calendarStore";
</script>

{#await $selectedMonthData}
    <p>Loading</p>
{:then days}
    <div
        id={`calendar-board_${$selectedMonth.getMonth()}`}
    >
        {#each Object.entries(days) as [day, events]}
            <CalendarCell
                day={parseInt(day)}
                busy={events.length !== 0}
                id={`cal-cell_${day}`}
            />
        {/each}
    </div>
    {#if $selectedDay}
        <DayDetail day={$selectedDay} events={$selectedDayData} />
    {/if}
    {#if $eventFormDay}
        <EventForm/>
    {/if}
{:catch error}
    <p>{error}</p>
{/await}
