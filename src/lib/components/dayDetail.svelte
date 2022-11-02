<script lang="ts">
    import type { TEventResponse } from "src/types/event.types";
    import { slide } from "svelte/transition";
    import { quadIn, quadOut } from "svelte/easing";
    import {
        eventFormDay,
        flag,
        selectedMonthData,
        selectedDay,
        isCalendarInteractable,
    } from "$lib/stores/calendarStore";
    import {
        calendarGridHeight,
        dayDetailListElementHeight,
        dayDetailListRemainingHeight,
        headerHeight,
    } from "$lib/stores/dimensionStore";
    import { tweened } from "svelte/motion";

    export let day: number;
    export let events: TEventResponse[] = [];

    function addEvent() {
        eventFormDay.setDay(day);
    }
    import { afterUpdate, onDestroy, beforeUpdate, tick } from "svelte";
    let interval;
    let div;
    let h;

    // afterUpdate(() => {
    //     div = document.getElementById("chuj");
    //     if (div) {
    //         div.style.height = `${h}px`;
    //     }
    // });

    function beginScroll(div1) {
        const a = window.innerHeight;
        div = div1;
        const addEventButton = document.getElementById("add-event-button");
        const dayDetailList = div1;
        const dayDetail = document.getElementById("day-detail-list").firstElementChild;

        dayDetailListElementHeight.set(dayDetail.clientHeight);
        dayDetailListRemainingHeight.set(dayDetailList.clientHeight - dayDetail.clientHeight * events.length);
        interval = setInterval(() => {
            // window.scrollBy(0, 300);
            if (document.body.scrollHeight / a < 1.5) {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    left: 0,
                    behavior: "smooth",
                });
            }
        }, 10);

        return {
            destroy() {
                isCalendarInteractable.set(true);
            },
        };
    }
    let minH = 100 - ($headerHeight / window.innerHeight) * 100 - ($calendarGridHeight / window.innerHeight) * 100;

    // beforeUpdate(() => {
    //     if ($dayDetailListElementHeight !== 0 && $dayDetailListRemainingHeight !== 0 && div) {
    //     console.log(div.clientHeight, div.offsetHeight, div.scrollHeight)
    //         const calculatedHeight = $dayDetailListRemainingHeight + events.length * $dayDetailListElementHeight;
    //         if ((calculatedHeight / window.innerHeight) * 100 > minH) {
    //             div.style.height = `${calculatedHeight}px`;
    //         } else {
    //             div.style.height = `${minH}vh`;
    //         }
    //     }
    //
    // });
    function endScroll() {
        clearInterval(interval);
        isCalendarInteractable.set(true);

        document.querySelectorAll(".cal-cell").forEach((e) => {
            (e as HTMLElement).classList.add("hover:bg-neutral-700");
            (e as HTMLElement).classList.add("hover:cursor-pointer");
        });
        // monitorHeight();
    }
    function lockButtons() {
        isCalendarInteractable.set(false);
        document.querySelectorAll(".cal-cell").forEach((e) => {
            (e as HTMLElement).classList.remove("hover:bg-neutral-700");
            (e as HTMLElement).classList.remove("hover:cursor-pointer");
        });
    }

    const t = tweened(0);
    $: {
        if (div) {
            console.log($t)
            div.style.height = `${$t}px`;
        }
    }


    function onUse(e: HTMLElement) {
        let h = e.clientHeight;
        const a = window.innerHeight;
        div = e;
        const addEventButton = document.getElementById("add-event-button");
        const dayDetailList = e;
        const dayDetail = document.getElementById("day-detail-list").firstElementChild;

        dayDetailListElementHeight.set(dayDetail.clientHeight);
        dayDetailListRemainingHeight.set(dayDetailList.clientHeight - dayDetail.clientHeight * events.length);
        div.addEventListener("transitioncancel", () => console.log("dupa"));

        t.set(400);
    }
</script>

<div use:onUse class="flex justify-center overflow-hidden  bg-neutral-900 transition-all duration-[5000ms]" id="chuj">
    <div bind:offsetHeight={h} class="w-10/12" style={`min-height: ${minH}vh;`} id="day-detail-list-wrapper">
        <div id="add-event-button">
            <button on:click={addEvent}>Add Event</button>
        </div>
        <div id="day-detail-list">
            {#if $selectedDay}
                {#each events as event}
                    <div class="pt-20 text-white">
                        <span>{event.title}</span>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>
