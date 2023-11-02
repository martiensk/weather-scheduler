<template>
  <UContainer>
    <UCard class="max-w-[400px] m-auto my-8">

      <UInput
        v-model="password"
        :type="type"
        :ui="{ icon: { trailing: { pointer: '' } } }"
        :color="!isValid ? 'red' : 'white'"
        placeholder="Set the Administrator password..."
        @blur="dirty = true">

        <template #trailing>
          <UButton
            class="z-10"
            color="gray"
            variant="link"
            :padded="false"
            :icon="type === 'password' ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
            @click="toggleType" />
        </template>

      </UInput>

      <p
        v-if="!isValid"
        class="text-xs m-1 text-red-500">
        Password must contain 8 or more characters, an uppercase and lowercase letter, and a number.
      </p>

      <UButton
        class="mt-4 mb-2"
        size="xs"
        :disabled="!isValid"
        :loading="processing"
        @click="submit">
        Submit
      </UButton>

      <p class="text-xs text-gray-400">
        * Make sure to take note of your password, you cannot change it afterwards.
      </p>

    </UCard>
  </UContainer>
</template>
<script setup lang="ts">
/**
 * @file Component to set the admin password.
 */

const config = useRuntimeConfig();

const password = ref('');
const dirty = ref(false);
const type = ref('password');
const processing = ref(false);

const toggleType = (): void => {
  type.value = type.value === 'password' ? 'text' : 'password';
};

const isValid = computed(() => !dirty.value || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password.value));

const submit = () => {
  if(isValid.value && dirty.value) {
    processing.value = true;
    const toast = useToast();

    try {

      const { data } = useFetch<{ success: boolean }>(config.public.apiBase + '/auth/set-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password.value })
      });

      console.log(data, data.value);

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

        navigateTo('/');
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
  if(!dirty.value) {
    dirty.value = true;
  }
};

</script>