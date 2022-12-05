<script lang="ts">
    import type { TEventResponse } from "src/types/event.types";
    import { slide } from "svelte/transition";

    export let event: TEventResponse;

    let isEventDetailDisplayed = false;

    const toggleEventDetail = () => {
        const a = document.getSelection();
        if (a && a.type === "Range") {
            return;
        }
        isEventDetailDisplayed = !isEventDetailDisplayed;
    };

    const scrollIfNeccessary = (e: any) => {
        const rect = e.target.parentElement.getBoundingClientRect();
        console.log(rect.bottom);
        if (rect.bottom > window.innerHeight) {
            window.scrollBy({
                top: rect.bottom - window.innerHeight,
                left: 0,
                behavior: "smooth",
            });
        }
    };
</script>

{#if event.ending || event.place || event.description}
    <div
        on:click={toggleEventDetail}
        on:keydown={toggleEventDetail}
        class="px-2 py-2 text-white transition-colors duration-500 ease-in-out hover:cursor-pointer
        hover:bg-neutral-800"
    >
        <div class="text-lg font-light tracking-wide">
            <h5
                style:text-decoration={isEventDetailDisplayed ? "none" : ""}
                class="text-lg font-normal tracking-wider underline decoration-neutral-700 
                decoration-1 underline-offset-4"
            >
                {event.title}
            </h5>
            <p>
                {#if isEventDetailDisplayed}
                    {#if event.ending}
                        {event.beginning.getHours()}:{event.beginning.getMinutes()} - {event.ending.getHours()}:{event.ending.getMinutes()}
                    {:else}
                        {event.beginning.getHours()}:{event.beginning.getMinutes()}
                    {/if}
                {:else}
                    {event.beginning.getHours()}:{event.beginning.getMinutes()}
                {/if}
            </p>
        </div>
        {#if isEventDetailDisplayed}
            <div
                transition:slide|local
                on:introend={(e) => scrollIfNeccessary(e)}
                class="text-lg font-light tracking-wide"
            >
                {#if event.place}
                    <p>{event.place}</p>
                {/if}
                {#if event.description}
                    <p>{event.description}</p>
                {/if}
            </div>
        {/if}
    </div>
{:else}
    <div class="p-2 text-white">
        <div>
            <h5 class="text-lg font-normal tracking-wider">{event.title}</h5>
            <p class="text-lg font-light tracking-wide">
                {event.beginning.getHours()}:{event.beginning.getMinutes()}
            </p>
        </div>
    </div>
{/if}
