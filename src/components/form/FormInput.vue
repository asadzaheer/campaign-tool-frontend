<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="mt-1">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="h-9 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        :class="{ 'border-red-300': hasError }"
        v-bind="$attrs"
      />
    </div>
    <TransitionGroup tag="div" class="mt-2">
      <template v-for="(error, index) in errors" :key="index">
        <p
          class="text-sm text-red-600 transition duration-100 ease-out"
          :class="{
            'transform scale-95 opacity-0': !error,
            'transform scale-100 opacity-100': error
          }"
        >
          {{ error }}
        </p>
      </template>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  errors: {
    type: Array,
    default: () => []
  }
});

defineEmits(['update:modelValue']);

const hasError = computed(() => props.errors && props.errors.length > 0);

defineExpose({
  hasError
});
</script>
