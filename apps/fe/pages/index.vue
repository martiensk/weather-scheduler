<template>
  <UContainer class="grid grid-cols-3 grid-flow-row gap-4">
    <WeatherCard
      v-for="job in jobs"
      :key="job.id"
      :weather="job" />
  </UContainer>
</template>
<script setup lang="ts">
/**
 * @file Index.
 */
import type { IScheduledJob } from 'shared-lib/src/interfaces/jobs.interfaces';

const config = useRuntimeConfig();

const { data } = await useFetch<IScheduledJob[]>(`${config.public.apiBase}/scheduler/get-jobs`);
const jobs = ref<Record<string, IScheduledJob>>({});

if(data.value){
  jobs.value = data.value.reduce((acc, job) => {
    acc[job.id] = job;
    return acc;
  }, {} as Record<string, IScheduledJob>);
}
</script>