<script lang="ts">
    import { eventFormDay } from "$lib/stores/calendarStore";
</script>

<div class="modal">
    <div class="event-form-wrapper">
        <form
            action="http://localhost:5173/api/add-event"
            method="post"
            class="event-form"
        />
    </div>
</div>
