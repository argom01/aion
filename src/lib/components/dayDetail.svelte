<script lang="ts">
    import type { TEventResponse } from "src/types/event.types";
    import { slide } from "svelte/transition";
    import { quadIn, quadOut } from "svelte/easing";
    import { eventFormDay, selectedDay } from "$lib/stores/calendarStore";
    import {
        calendarGridHeight,
        dayDetailListElementHeight,
        dayDetailListRemainingHeight,
        headerHeight,
    } from "$lib/stores/dimensionStore";

    export let day: number;
    export let events: TEventResponse[] = [];

    let minH =
        100 - ($headerHeight / window.innerHeight) * 100 - ($calendarGridHeight / window.innerHeight) * 100;

    let expandingDivHeight = 0;
    let div: HTMLElement;
    let scroll: any;

    $: if (div && expandingDivHeight !== 0) {
        div.style.height = `${expandingDivHeight}px`;
    }

    async function scrollDown() {
        scroll = setInterval(() => {
            if (document.body.scrollHeight / window.innerHeight < 1.5) {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    left: 0,
                    behavior: "smooth",
                });
            }
        }, 10);
    }

    function onUse(e: HTMLElement, _l: number) {
        div = e;

        const expandingDiv = e;
        const dayDetail = document.getElementById("day-detail-list")!.firstElementChild;
        if (!dayDetail) {
            selectedDay.set(null);
        }

        dayDetailListElementHeight.set(dayDetail!.clientHeight);
        dayDetailListRemainingHeight.set(expandingDiv.clientHeight - dayDetail!.clientHeight * events.length);

        div.style.height = `${e.clientHeight}px`;
        div.addEventListener("transitionend", () => {
            clearInterval(scroll);
            window.scrollTo({
                top: document.body.scrollHeight,
                left: 0,
                behavior: "smooth"
            })
        });
        div.addEventListener("transitioncancel", () => clearInterval(scroll));
        div.addEventListener("animationcancel", () => clearInterval(scroll));
        div.addEventListener("transitionstart", () => scrollDown());

        return {
            update(l: number) {
                const calculatedHeight = $dayDetailListRemainingHeight + l * $dayDetailListElementHeight;
                if ((calculatedHeight / window.innerHeight) * 100 > minH) {
                    expandingDivHeight = calculatedHeight;
                } else {
                    expandingDivHeight = (minH * window.innerHeight) / 100;
                }
            },
        };
    }
</script>

<div
    use:onUse={events.length}
    in:slide={{duration: 1500, easing: quadOut}}
    out:slide={{duration: 1500, easing: quadIn}}
    on:introstart={() => scrollDown()}
    on:introend={() => clearInterval(scroll)}
    class="flex justify-center overflow-hidden bg-neutral-900  transition-all duration-800 ease-in"
    id="expanding-div"
>
    <div class="w-10/12" style={`min-height: ${minH}vh;`} id="day-detail-list-wrapper">
        <div id="add-event-button">
            <button on:click={() => {}}>Add Event</button>
        </div>
        <div id="day-detail-list">
            {#each events as event}
                <div class="pt-20 text-white">
                    <span>{event.title}</span>
                </div>
            {/each}
        </div>
    </div>
</div>
