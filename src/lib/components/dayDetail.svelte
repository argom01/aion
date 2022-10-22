<script lang="ts">
    export let events: any = [];
</script>

<div class="day-detail-list">
    {#each events as event}
        <div id={`day-event_${event.id}`}>
            <span>{event.title}</span>
        </div>
    {/each}
</div>
