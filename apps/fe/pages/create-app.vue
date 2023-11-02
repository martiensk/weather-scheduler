<template>
  <UContainer>
    <UCard class="max-w-[400px] m-auto my-8">

      <form @submit.prevent="submit">

        <UiInputPassword
          v-model="password"
          @is-valid="setValid" />

        <UButton
          class="mt-4 mb-2"
          size="xs"
          :disabled="!isValid"
          :loading="processing"
          type="submit"
          @click="submit">
          Submit
        </UButton>

        <p class="text-xs text-gray-400">
          * Make sure to take note of your password, you cannot change it afterwards.
        </p>

      </form>
    </UCard>
  </UContainer>
</template>
<script setup lang="ts">
/**
 * @file Component to set the admin password.
 */

const config = useRuntimeConfig();

//#region Properties
/**
 * Ref for password input field.
 */
const password = ref('');

/**
 * Indicates whether the form is currently being processed.
 */
const processing = ref(false);

/**
 * Indicates whether the input is valid or not.
 */
const isValid = ref(false);
//#endregion

//#region Methods
/**
 * Sets the value of isValid to the given boolean value.
 * @param {boolean} evt - The boolean value to set isValid to.
 */
const setValid = (evt: boolean) => {
  isValid.value = evt;
};

/**
 * Sends a POST request to set the user's password.
 * Shows a success toast and navigates to the home page if the password is set successfully.
 * Shows an error toast if there is a problem setting the password.
 */
const submit = async() => {
  if(isValid.value) {
    processing.value = true;
    const toast = useToast();

    try {

      const { data } = await useFetch<{ success: boolean }>(config.public.apiBase + '/auth/set-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password.value })
      });

      if(data.value?.success) {

        toast.add({
          id: 'set_pw_success',
          title: 'Success!',
          description: 'Admin password updated.',
          icon: 'i-heroicons-check',
          timeout: 2000,
          color: 'green',
          actions: []
        });

        // We do not want to load the route client-side as we rely on server logic to enable the admin mode.
        window.location.href = '/';
        return;
      }

      throw new Error('There was a problem setting the password.');
    } catch (ex) {
      console.error(ex);
      processing.value = false;

      toast.add({
        id: 'set_pw_failed',
        title: 'Error!',
        description: 'There was a problem setting the password.',
        icon: 'i-heroicons-x-mark',
        timeout: 5000,
        color: 'red',
        actions: []
      });

    }

  }
};
//#endregion

</script>