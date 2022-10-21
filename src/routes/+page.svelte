<script lang="ts">
    import Calendar from "$lib/components/calendar.svelte";
    import { selectedMonth } from "$lib/stores/calendarStore";

    let currentDate = new Date();
    $: month = currentDate.getMonth();
    $: year = currentDate.getFullYear();
    $: monthString = currentDate.toLocaleString("default", { month: "long" });

</script>

<svelte:head>
    <title>Aion</title>
</svelte:head>

<h1>Aion</h1>

<button on:click={selectedMonth.decrementMonth}> Poprzedni miesiąc </button>
<p>
    {monthString}
    {year}
</p>
<button on:click={selectedMonth.incrementMonth}> Następny miesiąc </button>
<Calendar {month} {year} />
