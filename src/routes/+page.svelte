<script lang="ts">
    import Calendar from "$lib/components/calendar.svelte";
    import DaysLeft from "$lib/components/daysLeft.svelte";
    import { selectedMonth } from "$lib/stores/calendarStore";
</script>

<svelte:head>
    <title>Aion</title>
</svelte:head>

<header class="flex flex-row bg-black py-4">
    <div class="flex basis-1/4 items-center justify-center">
        <button
            class="rounded-md bg-black p-2.5 text-lg
            font-light tracking-wider text-white outline outline-2 outline-neutral-500
            transition-all duration-500 ease-in-out
            hover:bg-neutral-700"
            on:click={selectedMonth.decrementMonth}
        >
            Poprzedni miesiąc
        </button>
    </div>
    <div class="flex basis-1/2 flex-col text-white">
        <h1 class="text-center font-slab text-5xl font-bold tracking-widest">
            Aion
        </h1>
        <p class="text-center text-xl tracking-widest">
            {$selectedMonth.toLocaleString("default", { month: "long" })}
            {$selectedMonth.getFullYear()}
        </p>
    </div>
    <div class="flex basis-1/4 items-center justify-center">
        <button
            class="rounded-md bg-black p-2.5 text-lg
            font-light tracking-wider text-white outline outline-2 outline-neutral-500
            transition-all duration-500 ease-in-out
            hover:bg-neutral-700"
            on:click={selectedMonth.incrementMonth}
        >
            Następny miesiąc
        </button>
    </div>
</header>
<main>
    <DaysLeft />
    <Calendar />
</main>
