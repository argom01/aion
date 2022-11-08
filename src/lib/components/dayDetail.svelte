<script lang="ts">
    import type { TEventResponse } from "src/types/event.types";
    import { slide } from "svelte/transition";
    import { quadIn, quadOut } from "svelte/easing";
    import { calendarGridHeight, headerHeight } from "$lib/stores/dimensionStore";

    export let day: number;
    export let events: TEventResponse[] = [];

    let minH =
        100 - ($headerHeight / window.innerHeight) * 100 - ($calendarGridHeight / window.innerHeight) * 100;

    let div: HTMLElement;
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
        div = e;

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
                scrollDown();
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
    in:slide={{ duration: 1500, easing: quadOut }}
    out:slide={{ duration: 1500, easing: quadIn }}
    on:introstart={() => scrollDown()}
    on:introend={() => {
        clearInterval(scroll);
    }}
    on:outrostart={() => {
        document.body.style.height = "";
    }}
    class="flex justify-center overflow-hidden bg-neutral-900"
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
