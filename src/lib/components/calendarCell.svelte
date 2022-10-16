<script lang="ts">
    export let day: number;
    export let busy: boolean = false;
    export let id: string;
</script>

<div class="cal-cell" {id}>
    <p>{day}</p>
    {#if busy}
        <span>Event</span>
    {/if}
</div>
