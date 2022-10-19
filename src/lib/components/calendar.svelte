<script lang="ts">
    import CalendarCell from "./calendarCell.svelte";
    import DayDetail from "./dayDetail.svelte";

    export let month: number;
    export let year: number;

    async function fetchMonth(month: number, year: number) {
        const response = await fetch(
            `http://localhost:5173/api/get-events/${month + 1}/${year}`
        );

        if (response.status === 200) {
            const data = await response.json();
            return Object.entries(data);
        } else {
            throw new Error(response.statusText);
        }
    }

    let days: any;
    $: {
        days = fetchMonth(month, year);
    }
</script>

{#await days}
    <p>Loading</p>
{:then days}
    <div class="calendar-board" id={`calendar-board_${month}`}>
        {#each days as [day, events]}
            <CalendarCell
                {day}
                busy={events.length !== 0}
                id={`cal-cell_${day}`}
            />
        {/each}
    </div>
    <DayDetail/>
{:catch error}
    <p>{error}</p>
{/await}
