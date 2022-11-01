<script lang="ts">
    import Calendar from "$lib/components/calendar.svelte";
    import { selectedMonth, daysLeft } from "$lib/stores/calendarStore";
    import { headerHeight } from '$lib/stores/dimensionStore'
</script>

<svelte:head>
    {#await $daysLeft}
        <title>Aion</title>
    {:then days}
        <title>Aion - {days}</title>
    {:catch}
        <title>Aion</title>
    {/await}
</svelte:head>

<header bind:offsetHeight={$headerHeight} class="flex h-[12vh] flex-row  bg-black">
    <div class="flex basis-1/3 items-center justify-center">
        <button
            class="rounded-md bg-black p-2.5 font-oswald
            text-lg font-light tracking-wider text-white outline outline-2 outline-neutral-500
            transition-all duration-500 ease-in-out
            hover:bg-neutral-700"
            on:click={selectedMonth.decrementMonth}
        >
            Poprzedni miesiąc
        </button>
    </div>
    <div class="flex basis-1/3 flex-col self-center text-white">
        <h1 class="text-center font-slab text-5xl font-bold tracking-widest">
            Aion
        </h1>
        <p class="text-center font-oswald text-xl tracking-widest">
            {$selectedMonth.toLocaleString("default", { month: "long" })}
            {$selectedMonth.getFullYear()}
        </p>
    </div>
    <div class="flex basis-1/3 items-center justify-center">
        <button
            class="rounded-md bg-black p-2.5 font-oswald
            text-lg font-light tracking-wider text-white outline outline-2 outline-neutral-500
            transition-all duration-500 ease-in-out
            hover:bg-neutral-700"
            on:click={selectedMonth.incrementMonth}
        >
            Następny miesiąc
        </button>
    </div>
</header>
<main
    class="flex flex-col items-center bg-black"
>
    <Calendar />
</main>
