<template>
  <UButton
    :icon="isAdmin ? 'i-heroicons-lock-open' : 'i-heroicons-lock-closed'"
    :color="!isAdmin ? 'green' : 'red'"
    aria-label="Admin Mode"
    :disabled="!hasAdminRole"
    @click="toggleAdmin" />

  <UModal v-model="showModal">
    <UCard>

      <form @submit.prevent="login">
        <UiInputPassword
          v-model="password"
          placeholder-text="Enter the Administrator password..."
          @is-valid="setValid" />

        <UButton
          class="mt-4"
          :disabled="!isValid || processing || !password"
          type="submit">
          Log In
        </UButton>
      </form>
    </UCard>
  </UModal>

</template>
  
<script setup lang="ts">
/**
 * @file Colour mode button.
 */
  
/**
 * Nuxt state of whether the user is an admin or not.
 */
const isAdmin = useState<boolean>('isAdmin', () => false);
const hasAdminRole = useState('adminExists', () => false);

//#region Properties
/**
 * A reactive variable that controls whether or not the modal is currently being shown.
 */
const showModal = ref(false);
/**
 * The password input.
 */
const password = ref('');
/**
 * A reactive variable indicating whether the current state is valid or not.
 */
const isValid = ref(false);
/**
 * Indicates whether the component is currently processing a login request.
 */
const processing = ref(false);
//#endregion

//#region Methods
/**
 * Sets the validity of the component state.
 * @param {boolean} valid - Whether or not the current state is valid.
 */
const setValid = (valid: boolean) => {
  isValid.value = valid;
};

/**
 * Toggles the admin mode.
 * If the user is currently in admin mode, it will be turned off.
 * If the user is not in admin mode, a modal will be shown to allow an admin login.
 */
const toggleAdmin = () => {
  if(isAdmin.value) {
    const cookie = useCookie('token', { expires: new Date(0)  });
    cookie.value = '';
    isAdmin.value = false;
  } else {
    password.value = '';
    showModal.value = true;
  }
};

/**
 * Function to handle login functionality for admin mode button.
 * @returns {Promise<void>}
 * @async
 */
const login = async() => {
  if(!isValid.value) { 
    showModal.value = false;
    return; 
  }
  const toast = useToast(); 

  try {
    const config = useRuntimeConfig();

    const { data } = await useFetch<{ success: boolean, token: string }>(config.public.apiBase + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: password.value })
    });

    if(data.value?.success) {
      const cookie = useCookie('token', {
        expires: new Date(Date.now() + 60 * 60 * 1000) // expires in an hour
      });
      cookie.value = data.value.token;

      toast.add({
        id: 'add_weather_success',
        title: 'Success!',
        description: 'Weather job created.',
        icon: 'i-heroicons-check',
        timeout: 2000,
        color: 'green',
        actions: []
      });

      showModal.value = false;
      isAdmin.value = true;
      return;
    }

    toast.add({
      id: 'auth_failed',
      title: 'Error!',
      description: 'Login failed',
      icon: 'i-heroicons-x-mark',
      timeout: 5000,
      color: 'red',
      actions: []
    });

  } catch(err) {
    console.error(err);

    toast.add({
      id: 'auth_failed',
      title: 'Error!',
      description: 'There was a problem authenticating with the server.',
      icon: 'i-heroicons-x-mark',
      timeout: 5000,
      color: 'red',
      actions: []
    });

  } 
};
//#endregion
</script>