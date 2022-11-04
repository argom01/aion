<script lang="ts">
    import { selectedDay } from "$lib/stores/calendarStore";
    export let day: number;
    export let busy: boolean = false;
    export let weekDay: number;

    function toggleDay() {
        if ($selectedDay === day) {
            selectedDay.set(null);
        } else {
            if (busy) {
                selectedDay.set(day);
            }
        }
    }
</script>

<div
    style={`grid-column-start: ${weekDay};`}
    class="cal-cell
    flex h-16 flex-col justify-center rounded-md
    outline outline-2
    outline-neutral-500
    transition-all duration-500 ease-in-out
    hover:cursor-pointer hover:bg-neutral-700"
    on:keydown={toggleDay}
    on:click={toggleDay}
>
    <p class="basis-3/5 pt-1.5 text-center font-oswald text-lg font-normal tracking-wider text-white">
        {day}
    </p>
    <div class="flex basis-2/5 justify-center pt-0.5">
        {#if busy}
            <div class="h-2.5 w-2.5 rounded-full bg-violet-800" />
        {/if}
    </div>
</div>
