<template>
  <UInput
    :model-value="modelValue"
    :type="type"
    :ui="{ icon: { trailing: { pointer: '' } } }"
    :color="!isValid && dirty ? 'red' : 'white'"
    :placeholder="placeholderText"
    @update:model-value="updateValue"
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
    v-if="!isValid && dirty"
    class="text-xs m-1 text-red-500">
    Password must contain 8 or more characters, an uppercase and lowercase letter, and a number.
  </p>
</template>
<script setup lang="ts">
/**
 * @file A toggle-able password input.
 */

defineProps({
  modelValue: {
    type: String,
    required: true
  },
  placeholderText: {
    type: String,
    default: 'Set the Administrator password...'
  }
});

const emit = defineEmits(['update:model-value', 'is-valid']);

//#region Properties
/**
 * Indicates whether the form has been modified or not.
 */
const dirty = ref(false);
/**
 * Determines the type ofd the input field. Used for masking / unmasking the password.
 */
const type = ref('password');

/**
 * Property that tracks if the password is valid.
 */
const isValid = ref(false);

/**
 * Toggles the input type between 'password' and 'text'.
 */
const toggleType = (): void => {
  type.value = type.value === 'password' ? 'text' : 'password';
};
//#endregion

//#region Methods
/**
 * Emits an event signalling an update the value of the input field as well as the dirty state.
 * @param {string} value - The new value of the input field.
 */
const updateValue = (value: string): void => {
  emit('update:model-value', value);
  isValid.value = testValue(value);
  emit('is-valid', testValue(value));
};

/**
 * Tests if a given string value meets the following criteria:
 * - At least 8 characters long
 * - Contains at least one lowercase letter
 * - Contains at least one uppercase letter
 * - Contains at least one digit.
 * @param {string} value - The string value to test.
 * @returns {boolean} - Returns true if the value meets the criteria, false otherwise.
 */
const testValue = (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value);
//#endregion

onMounted(() => {
  emit('is-valid', isValid.value);
});

</script>