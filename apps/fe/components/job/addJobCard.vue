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

const save = async() => {
  saving.value = true;
  const toast = useToast();
  const config = useRuntimeConfig();

  try {
    const { data } = await useFetch(`${config.public.apiBase}/scheduler/add`, {
      method: 'POST',
      body: JSON.stringify({
        type: selectedJob.value,
        details: { location: selectedCountry.value }, // Obviously needs to be calculated if we add more job types.
        schedule: selectedSchedule.value
      })
    });

    if((data.value as { success: boolean }).success) {

      toast.add({
        id: 'add_weather_success',
        title: 'Success!',
        description: 'Weather job created.',
        icon: 'i-heroicons-check',
        timeout: 2000,
        color: 'green',
        actions: []
      });

      emit('close');

      return;
    }

    throw new Error('No data returned from API.');
  } catch (err) {
    console.error(err);
    saving.value = false;
    toast.add({
      id: 'add_weather_failed',
      title: 'Error!',
      description: 'There was a problem creating the weather job.',
      icon: 'i-heroicons-x-mark',
      timeout: 5000,
      color: 'red',
      actions: []
    });
  }
};
</script>
