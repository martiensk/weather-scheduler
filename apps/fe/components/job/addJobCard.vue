<template>
  <UCard class="w-[300px] max-w-[400px] relative overflow-visible">

    <template #header>
      Add a <span class="lowercase">{{ EJobType[selectedJob] }}</span> job.
    </template>

    <div class="grid grid-cols-2 gap-2 items-center">
      
      <span class="pr-2">Select a Job:</span>
      <USelect
        v-model="selectedJob"
        class="inline-block"
        :options="selectJobOptions"
        option-attribute="name" />

      <template v-if="selectedJob === EJobType.WEATHER">
        <span class="pr-2">Select a Country:</span>
        <JobWeatherLocationSelect
          v-model="selectedCountry" />
      </template>

      <span class="pr-2">Select a Schedule:</span>
      <USelect
        v-model="selectedSchedule"
        class="inline-block"
        :options="selectScheduleOptions"
        option-attribute="name" />

    </div>

  </UCard>
</template>
<script setup lang="ts">
/**
 * @file A card that allows us to add a job.
 */

import { EJobType } from 'shared-lib/src/enums/jobs.enums';

const selectJobOptions = [{ name: 'Weather', value: EJobType.WEATHER }];
const selectedJob = ref(EJobType.WEATHER);

const selectScheduleOptions = [
  { code: 'XMinutes', name: 'Every X Minutes' },
  { code: 'XHours', name: 'Every X Hours' },
  { code: 'Schedule', name: 'Schedule' }
];
const selectedSchedule = ref(selectScheduleOptions[0].code);
const selectedCountry = ref('');
</script>
