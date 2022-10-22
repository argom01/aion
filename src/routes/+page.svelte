<script lang="ts">
    import Calendar from "$lib/components/calendar.svelte";
    import {
        selectedMonth,
    } from "$lib/stores/calendarStore";
</script>

<svelte:head>
    <title>Aion</title>
</svelte:head>

<h1>Aion</h1>

<button on:click={selectedMonth.decrementMonth}> Poprzedni miesiąc </button>
<p>
    {$selectedMonth.toLocaleString("default", { month: "long" })}
    {$selectedMonth.getFullYear()}
</p>
<button on:click={selectedMonth.incrementMonth}> Następny miesiąc </button>
<Calendar />
