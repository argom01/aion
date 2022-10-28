<script lang="ts">
    const daysLeft = fetch("/api/days-until-liberation")
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            }

            throw new Error(response.statusText);
        })
        .then((data) => data)
        .catch((e) => {
            throw e;
        });
</script>

<div id="days-left">
    {#await daysLeft}
        <p>Loading...</p>
    {:then days}
        <p>{days.daysLeft}</p>
    {:catch error}
        <p>{error}</p>
    {/await}
</div>
