<script lang="ts">
    import Calendar from "$lib/components/calendar.svelte";

    let currentDate = new Date();
    $: month = currentDate.getMonth();
    $: year = currentDate.getFullYear();
    $: monthString = currentDate.toLocaleString("default", { month: "long" });

    function incrementMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate = currentDate;
    }

    function decrementMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        currentDate = currentDate;
    }
</script>

<svelte:head>
    <title>Aion</title>
</svelte:head>

<h1>Aion</h1>

<button on:click={decrementMonth}> Poprzedni miesiąc </button>
<p>
    {monthString}
    {year}
</p>
<button on:click={incrementMonth}> Następny miesiąc </button>
<Calendar {month} {year} />
