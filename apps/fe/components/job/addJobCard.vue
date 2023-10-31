<template>
  <UCard class="relative overflow-visible ring-0">

    <template #header>
      <div class="flex justify-between items-center">
        <span>Add a <span class="lowercase">{{ EJobType[selectedJob] }}</span> job.</span>

        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="$emit('close')" />
      </div>
    </template>

    <div class="flex flex-col">
      
      <span class="mb-1">Select a Job:</span>
      <USelect
        v-model="selectedJob"
        :options="selectJobOptions"
        option-attribute="name" />

      <template v-if="selectedJob === EJobType.WEATHER">
        <span class="mb-1 mt-4">Select a Country:</span>
        <JobWeatherLocationSelect
          v-model="selectedCountry" />
      </template>

      <span class="mb-1 mt-4">Select a Schedule:</span>
      <JobSchedule v-model="selectedSchedule" />

      <UButton
        class="mt-4 justify-center"
        :loading="saving"
        :disabled="valid"
        @click="save">
        Save Job
      </UButton>

    </div>

  </UCard>
</template>
<script setup lang="ts">
/**
 * @file A card that allows us to add a job.
 */

import { EJobType } from 'shared-lib/src/enums/jobs.enums';

const emit = defineEmits(['close']);

const selectJobOptions = [{ name: 'Weather', value: EJobType.WEATHER }];
const selectedJob = ref(EJobType.WEATHER);

const selectedCountry = ref('');
const selectedSchedule = ref('');

const saving = ref(false);

const valid = computed(() => (Boolean(!selectedJob.value || !selectedCountry.value || !selectedSchedule.value)));

const save = () => {
  saving.value = true;
  const payload = {
    type: selectedJob.value,
    country: selectedCountry.value,
    schedule: selectedSchedule.value
  };
  console.log('payload', payload);
  setTimeout(() => {
    saving.value = false;
    emit('close');
  }, 1000);
};
</script>
