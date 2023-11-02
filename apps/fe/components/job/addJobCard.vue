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

import { EJobType } from 'shared-lib';

const emit = defineEmits(['close']);

//#region Properties
/**
 * An array of select options for a job type dropdown menu.
 */
const selectJobOptions = [{ name: 'Weather', value: EJobType.WEATHER }];
/**
 * Keeps track of the currently selected job type.
 */
const selectedJob = ref(EJobType.WEATHER);
/**
 * The selected country for the job being added.
 */
const selectedCountry = ref('');
/**
 * The selected schedule for the job being added.
 */
const selectedSchedule = ref('');

/**
 * A reactive variable that indicates whether a job is currently being saved.
 */
const saving = ref(false);
//#endregion

/**
 * Computed property that checks if the selected job, country, and schedule are all truthy.
 */
const valid = computed(() => (Boolean(!selectedJob.value || !selectedCountry.value || !selectedSchedule.value)));

/**
 * Saves the job by sending a POST request to the API with the selected job type, country, and schedule.
 * Shows a success toast message and emits a 'close' event if the job is successfully created.
 * Shows an error toast message if there is a problem creating the job.
 * @async
 */
const save = async() => {
  saving.value = true;
  const toast = useToast();
  const config = useRuntimeConfig();

  const token = useCookie<string>('token');

  if(!token.value) {
    toast.add({
      id: 'delete_weather_failed',
      title: 'Error!',
      description: 'You must be logged in to delete a weather job.',
      icon: 'i-heroicons-x-mark',
      timeout: 5000,
      color: 'red',
      actions: []
    });
    emit('close');
    return;
  }

  try {
    const { data } = await useFetch(`${config.public.apiBase}/scheduler/add`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
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
