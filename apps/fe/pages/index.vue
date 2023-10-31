<template>

  <UCard
    v-if="!data?.length && !isAdmin"
    class="text-xl flex justify-center">
    There are no jobs to display.
  </UCard>

  <UContainer class="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-4 lg:grid-cols-3 justify-items-center">

    <template v-for="job in data">
      <JobWeatherCard
        v-if="job.type === EJobType.WEATHER"
        :key="job.id"
        :weather="job"
        @delete:weather="deleteJob" />
    </template>

    <UCard
      v-if="isAdmin"
      class="w-[300px] max-w-[400px] relative overflow-visible flex justify-center items-center cursor-pointer group"
      @click="isAddJobModalOpen = true">
      <UIcon
        class="text-6xl scale-125 group-hover:scale-150 transition-all duration-300 ease-in-out"
        name="i-heroicons-plus" />
    </UCard>

    <UModal
      v-model="isAddJobModalOpen"
      :ui="{
        'header': {
          padding: 'text-xl font-bold'
        }
      }"
      prevent-close>
      <JobAddJobCard
        @close="isAddJobModalOpen = false" />
    </UModal>
      
  </UContainer>

</template>
<script setup lang="ts">
/** 
 * @file Index.
 */
import type { IScheduledJob } from 'shared-lib/src/interfaces/jobs.interfaces';
import { EWSSMessageType } from 'shared-lib/src/enums/wss.enums';
import { EJobType } from 'shared-lib/src/enums/jobs.enums';

const config = useRuntimeConfig();
const { data } = await useFetch<IScheduledJob[]>(`${config.public.apiBase}/scheduler/get-jobs`);
const isAdmin = useState<boolean>('isAdmin', () => false);
const isAddJobModalOpen = ref(false);

const deleteJob = (id: number) => {
  if(isAdmin.value && data.value) {
    data.value = data.value.filter((j) => j.id !== id);
  }
};

const doJobUpdate = (job: IScheduledJob) => {
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
};

onMounted(() => {
  /*
   * Listens to the event bus for updates on weather jobs and updates the last run time for the corresponding job in the data object.
   */
  eventBus.listen(EWSSMessageType.WEATHER_JOB_UPDATE, doJobUpdate);
});

onBeforeUnmount(() => {
  // Preventing memory leaks :)
  eventBus.off(EWSSMessageType.WEATHER_JOB_UPDATE, doJobUpdate);
});
</script>