<script lang="ts">
    import { Clock } from "svelte-loading-spinners";
    import CalendarCell from "./calendarCell.svelte";
    import DayDetail from "./dayDetail.svelte";
    import EventForm from "./eventForm.svelte";
    import { selectedMonthData, selectedMonth, selectedDay, eventFormDay } from "$lib/stores/calendarStore";
    import { calendarGridHeight } from "$lib/stores/dimensionStore";

    const week = () => {
        const a = new Date("2022-10-03");
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(a.toLocaleString("default", { weekday: "long" }));
            a.setDate(a.getDate() + 1);
        }

        return days;
    };
</script>

{#await $selectedMonthData}
    <div class="flex h-[88vh] justify-center items-start pt-48">
        <Clock color="#737373" />
    </div>
{:then monthData}
    <div class="min-h-[88vh] w-full">
        <div class="flex flex-col items-center justify-center py-12" bind:offsetHeight={$calendarGridHeight}>
            <div class="grid grid-cols-7 w-10/12 px-24 ">
                {#each week() as weekDay}
                    <div class="pb-8">
                        <p class="text-white text-center tracking-wider text-lg font-light font-oswald">
                            {weekDay}
                        </p>
                    </div>
                {/each}
            </div>
            <div class="grid grid-cols-7 px-24 w-10/12 ">
                {#each Object.entries(monthData) as [day, events]}
                    <CalendarCell
                        day={parseInt(day)}
                        busy={events.length !== 0}
                        weekDay={(($selectedMonth.getDay() + parseInt(day) + 5) % 7) + 1}
                    />
                {/each}
            </div>
        </div>
        {#if $selectedDay}
            <DayDetail day={$selectedDay} events={monthData[$selectedDay]} />
        {/if}
        {#if $eventFormDay}
            <EventForm />
        {/if}
    </div>
{:catch error}
    <div class="flex h-[88vh] justify-center items-center">
        <p class="text-center text-white">{error}</p>
    </div>
{/await}
