<script lang="ts">
    import type { TEventResponse } from "src/types/event.types";
    import { eventFormDay } from "$lib/stores/calendarStore";

    export let events: TEventResponse[] = [];
    export let day: number;

    function addEvent() {
        eventFormDay.setDay(day);
    }
</script>

<div>
    <button on:click={addEvent}>Add Event</button>
</div>
<div class="day-detail-list">
    {#each events as event}
        <div id={`day-event_${event.id}`}>
            <span>{event.title}</span>
        </div>
    {/each}
</div>
