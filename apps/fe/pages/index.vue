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

//#region Properties
const config = useRuntimeConfig();

/**
 * This code fetches scheduled jobs from the API endpoint using the useFetch hook and stores the response data in the 'data' variable.
 */
const { data } = await useFetch<IScheduledJob[]>(`${config.public.apiBase}/scheduler/get-jobs`);

/**
 * Defines a boolean state variable 'isAdmin' with an initial value of false.
 * The state variable can be accessed and updated using the 'useState' hook.
 */
const isAdmin = useState<boolean>('isAdmin', () => false);

/**
 * A reactive variable that determines whether the "Add Job" modal is currently open or not.
 * @type {object}
 */
const isAddJobModalOpen = ref(false);
//#endregion

//#region Methods
/**
 * Deletes a job with the given id from the data array if the user is an admin and data is not null.
 * @param {number} id - The id of the job to be deleted.
 */
const deleteJob = (id: number): void => {
  if(isAdmin.value && data.value) {
    data.value = data.value.filter((j) => j.id !== id);
  }
};

/**
 * Updates the scheduled job with the given job object.
 * If the job already exists in the data array, it updates the runs property.
 * If the job does not exist in the data array, it adds the job to the array.
 * @param {IScheduledJob} job - The job object to update or add.
 */
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
//#endregion

//#region Lifecycle hooks
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
//#endregion
</script>