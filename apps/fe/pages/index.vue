<template>

  <UCard
    v-if="!data?.length && !isAdmin"
    class="text-xl flex justify-center">
    There are no jobs to display.
  </UCard>

  <UContainer class="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-4 lg:grid-cols-3 justify-items-center">

    <template v-for="job in data">
      <WeatherCard
        v-if="job.type === EJobType.WEATHER"
        :key="job.id"
        :weather="job"
        @delete:weather="deleteJob" />
    </template>
      
  </UContainer>

</template>
<script setup lang="ts">
/**
 * @file Index.
 */
import type { IScheduledJob } from 'shared-lib/src/interfaces/jobs.interfaces';
import { EWSSMessageType } from 'shared-lib/src/enums/wss.enums';
import type { IWeatherCurrent } from 'shared-lib/src/interfaces/weather.interfaces';
import { EJobType } from 'shared-lib/src/enums/jobs.enums';

const config = useRuntimeConfig();
const { data } = await useFetch<IScheduledJob[]>(`${config.public.apiBase}/scheduler/get-jobs`);
const isAdmin = useState<boolean>('isAdmin', () => false);

const deleteJob = (id: number) => {
  if(isAdmin.value && data.value) {
    data.value = data.value.filter((j) => j.id !== id);
  }
};

onMounted(() => {
  /*
   * Listens to the event bus for updates on weather jobs and updates the last run time for the corresponding job in the data object.
   */
  eventBus.listen(EWSSMessageType.WEATHER_JOB_UPDATE, (job: IScheduledJob) => {
    if(data.value) {
  
      let itemFound = false;
      
      data.value = data.value.map((j) => {
        if(j.id === job.id){
          j.runs = job.runs;
          itemFound = true;
        }
        return j;
      });

      if(!itemFound) {
        data.value.push(job);
      }

    }
  });

});
</script>