<script lang="ts">
    import type { TEventResponse } from "src/types/event.types";

    import EventDetail from "./eventDetail.svelte";
    import { slide } from "svelte/transition";
    import { quadIn, quadOut } from "svelte/easing";
    import { calendarGridHeight, headerHeight } from "$lib/stores/dimensionStore";
    import { beforeUpdate } from "svelte";

    export let day: number;
    export let events: TEventResponse[] = [];

    let minH =
        100 - ($headerHeight / window.innerHeight) * 100 - ($calendarGridHeight / window.innerHeight) * 100;

    let scroll: any;

    async function scrollDown() {
        scroll = setInterval(() => {
            if (document.body.scrollHeight / window.innerHeight < 1.5) {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                });
                console.log("scroll");
            }
        }, 50);
    }

    let currentHeight: number;
    let newHeight: number;

    function onUse(e: HTMLElement, _l: number) {
        beforeUpdate(() => {
            document.body.style.height = document.body.clientHeight + "px";
            currentHeight = e.clientHeight;
        });

        currentHeight = e.clientHeight;

        let transition: any;
        return {
            update(_l: number) {
                if (e.style.animationPlayState === "running") {
                    document.body.style.height = "";
                    e.style.animationName = "";
                    e.style.animationPlayState = "";
                    e.style.animationDuration = "";
                    e.style.animationFillMode = "";
                    e.style.animationTimingFunction = "";
                    e.style.animationDirection = "";
                    e.style.animationDelay = "";
                    e.style.animationIterationCount = "";
                    document.body.style.height = "";
                    newHeight = e.clientHeight;
                    currentHeight = newHeight;
                    if (document.body.scrollHeight / window.innerHeight < 1.5) {
                        window.scrollTo({
                            top: document.body.scrollHeight,
                            behavior: "smooth",
                        });
                    }
                    return;
                }

                if (transition) {
                    transition.cancel();
                    document.body.style.height = "";
                    newHeight = e.clientHeight;
                    currentHeight = newHeight;
                    if (document.body.scrollHeight / window.innerHeight < 1.5) {
                        window.scrollTo({
                            top: document.body.scrollHeight,
                            behavior: "smooth",
                        });
                    }
                    return;
                }
                newHeight = e.clientHeight;
                if (newHeight > currentHeight) {
                    scrollDown();
                }
                transition = e.animate(
                    [
                        {
                            height: currentHeight + "px",
                            overflow: "hidden",
                        },
                        {
                            height: newHeight + "px",
                            overflow: "hidden",
                        },
                    ],
                    { duration: 1000, easing: "ease-out" }
                );
                document.body.style.height = "";
                transition.onfinish = () => {
                    console.log("transition finished");
                    clearInterval(scroll);
                    transition = undefined;
                };
                transition.oncancel = () => {
                    console.log("transition canceled");
                    clearInterval(scroll);
                    transition = undefined;
                };
                currentHeight = newHeight;
            },
        };
    }
</script>

<div
    use:onUse={events.length}
    in:slide|local={{ duration: 1500, easing: quadOut }}
    out:slide|local={{ duration: 1500, easing: quadIn }}
    on:introstart={() => {
        scrollDown();
        document.body.style.height = "";
    }}
    on:introend={() => {
        clearInterval(scroll);
    }}
    on:outrostart={() => {
        document.body.style.height = "";
    }}
    class="flex justify-center overflow-hidden bg-gradient-to-b from-[#101010] to-black"
    id="expanding-div"
>
    <div
        class="flex w-full flex-col items-center"
        style={`min-height: ${minH}vh;`}
        id="day-detail-list-wrapper"
    >
        <div id="add-event-button" class="w-full">
            <button
                on:click={() => {}}
                class="transition-color w-full py-2 text-center text-2xl font-light tracking-wider text-white 
                duration-500 ease-in-out hover:bg-neutral-800"
                >&#43;</button
            >
        </div>
        <div id="day-detail-list" class="w-10/12 divide-y-2 divide-solid divide-neutral-800">
            {#each events as event (event.beginning)}
                <EventDetail {event} />
            {/each}
        </div>
    </div>
</div>
