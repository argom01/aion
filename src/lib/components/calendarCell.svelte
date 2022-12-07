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
    style={`grid-column-start: ${weekDay}; 
    border-right: 2px ${weekDay === 7 ? "none" : "solid"} #262626;`}
    class="w-full box-content h-20
    flex flex-col justify-center items-center
    transition-all duration-500 ease-in-out
    hover:cursor-pointer hover:bg-neutral-800"
    on:keydown={toggleDay}
    on:click={toggleDay}
>
    <div class="basis-1/2 ">
        <p class="pt-2.5 text-center text-lg font-normal tracking-wider text-white">
            {day}
        </p>
    </div>
    <div class="flex basis-1/2 justify-center pt-1.5 border-b-neutral-800">
        {#if busy}
            <div class="h-3 w-3 rounded-full bg-violet-800" />
        {/if}
    </div>
</div>
