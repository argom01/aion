<script lang="ts">
    import CalendarCell from "./calendarCell.svelte";

    export let month: number;
    export let year: number;

    async function fetchMonth(month: number, year: number) {
        const response = await fetch(
            `http://localhost:5173/api/get-events/${month + 1}/${year}`
        );
        const data = await response.json();
        return Object.entries(data);
    }

    let days: any;
    $: {
        days = fetchMonth(month, year);
    }
</script>

<div class="calendar-board" id={`calendar-board_${month}`}>
    {#await days}
        <p>Loading</p>
    {:then days}
        {#each days as [day, events]}
            <CalendarCell
                {day}
                busy={events.length !== 0}
                id={`cal-cell_${day}`}
            />
        {/each}
    {:catch}
        <p>Error</p>
    {/await}
</div>
