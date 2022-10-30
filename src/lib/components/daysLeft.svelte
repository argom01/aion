<script lang="ts">
    import { daysLeft } from "$lib/stores/calendarStore";
</script>

<div class="text-white">
    {#await $daysLeft}
        <p>Loading...</p>
    {:then days}
        <p>{days}</p>
    {:catch error}
        <p>{error}</p>
    {/await}
</div>
