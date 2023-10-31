<template>
  <div>

    <USelect
      :model-value="selectedSchedule"
      :options="selectScheduleOptions"
      option-attribute="name"
      @update:model-value="updateScheduleSelection" />

    <URange
      v-if="selectedSchedule === 'XMinutes' || selectedSchedule === 'XHours'"
      :key="sliderDetails.step"
      v-model="interval"
      :min=" sliderDetails.min"
      :max="sliderDetails.max"
      :step="sliderDetails.step"
      class="my-4"
      @update:model-value="updateScheduleInterval" />

    <template v-else>

      <div class="mt-4">
        Select days and time:
      </div>
      <div
        class="flex items-center mt-2">
        <div
          v-for="(day, key) in daySelectOptions"
          :key="key"
          class="flex flex-col justify-center items-center mr-2">

          <UKbd class="col-span-1 grow-0">
            {{ key }}
          </UKbd>
          <UCheckbox
            :model-value="day.selected"
            class="col-span-1"
            @update:model-value="toggleDay(`${key}`)" />
        </div>

        <span class="mr-2">&nbsp;at&nbsp;</span>

        <input
          :value="scheduleDetails.time"
          type="time"
          name="appt-time"
          @input="setTime($event)">

      </div>
    </template>

    <UDivider class="my-4" />

    <p>{{ displayText }}</p>

  </div>
</template>
<script setup lang="ts">
/**
 * @file Schedule picker for a job.
 */

defineProps({
  modelValue: {
    type: String,
    required: true
  }
});
const emit = defineEmits(['update:modelValue']);

//#region Properties
/**
 * An array of objects representing the options for selecting a job schedule.
 */
const selectScheduleOptions = [
  { value: 'XMinutes', name: 'Every X Minutes' },
  { value: 'XHours', name: 'Every X Hours' },
  { value: 'Schedule', name: 'On a Schedule' }
];
/**
 * An object containing the options for selecting days of the week in the job schedule component.
 */
const daySelectOptions = ref<{[key:string]: { value: number, selected: boolean, name: string }}>({
  Mo: { value: 1, selected: true, name: 'Monday' },
  Tu: { value: 2, selected: true, name: 'Tuesday' },
  We: { value: 3, selected: true, name: 'Wednesday' },
  Th: { value: 4, selected: true, name: 'Thursday' },
  Fr: { value: 5, selected: true, name: 'Friday' },
  Sa: { value: 6, selected: true, name: 'Saturday' },
  Su: { value: 7, selected: true, name: 'Sunday' }
});
/**
 * The currently selected schedule for the job.
 */
const selectedSchedule = ref(selectScheduleOptions[0].value);
/**
 * The interval variable represents the time interval (in minutes) between job executions.
 */
const interval = ref(5);
/**
 * An object containing config details for the slider component.
 */
const sliderDetails = ref({
  min: 5,
  max: 60,
  step: 5
});
/**
 * An object containing details about the schedule.
 */
const scheduleDetails = ref({
  time: '13:30',
  days: []
});
//#endregion

/**
 * Computed property that returns the display text for the job schedule.
 */
const displayText = computed(() => {
  let text = `The job will ruin every ${interval.value} ${selectedSchedule.value === 'XMinutes' ? 'minutes' : 'hours'}.`;
  if(selectedSchedule.value === 'Schedule') {
    const days = Object.values(daySelectOptions.value)
      .filter((day) => day.selected)
      .map((day) => day.name);
    text = `The job will run at ${scheduleDetails.value.time} ${days.length == 7? 'every day' : `on ${days.join(', ')}`}.`;
  }

  return text;
});

//#region Methods

/**
 * Updates the selected schedule and slider details based on the given value.
 * @param {string} value - The value to update the selected schedule with.
 */
const updateScheduleSelection = (value: string) => {
  selectedSchedule.value = value;

  if(value === 'XMinutes') {
    sliderDetails.value = {
      min: 5,
      max: 60,
      step: 5
    };
    interval.value = 5;
  } else {
    sliderDetails.value = {
      min: 1,
      max: 24,
      step: 1
    };
    interval.value = 1;
  }

  updateSchedule();
};

/**
 * Updates the schedule interval with the given value and triggers an update of the schedule.
 * @param {number} value - The new value for the schedule interval.
 */
const updateScheduleInterval = (value: number) => {
  interval.value = value;
  updateSchedule();
};

/**
 * Updates the schedule based on the selected schedule type and interval/time/schedule details.
 * Emits an 'update:modelValue' event with the updated schedule.
 */
const updateSchedule = () => {

  let schedule = '';

  switch(selectedSchedule.value) {
  case 'XMinutes':
    schedule =  `*/${interval.value} * * * *`;
    break;
  case 'XHours':
    schedule =  `0 */${interval.value} * * *`;
    break;
  case 'Schedule':
    const time = scheduleDetails.value.time.split(':');
    const days = Object.values(daySelectOptions.value)
      .filter((day) => day.selected)
      .map((day) => day.value)
      .join(',');
    schedule =  `${time[1]} ${time[0]} * * ${days}`;
    break;
  default:
    break;
  }

  emit('update:modelValue', schedule);
};

/**
 * Sets the time for the job schedule.
 * @param {Event} evt - The input even.
 */
const setTime = (evt: Event) => {
  const time = (evt.target as HTMLInputElement)?.value;
  scheduleDetails.value.time = time;
  updateSchedule();
};

/**
 * Toggles the selected state of a day in the daySelectOptions object and updates the schedule.
 * @param {string} day - The day to toggle.
 */
const toggleDay = (day: string) => {
  daySelectOptions.value[day].selected = !daySelectOptions.value[day].selected;
  updateSchedule();
};
//#endregion

onMounted(() => {
  updateSchedule();
});

</script>