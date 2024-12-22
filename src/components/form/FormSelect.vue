<template>
  <div>
    <Listbox :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
      <div class="relative">
        <ListboxLabel class="block text-sm font-medium text-gray-700">{{ label }}</ListboxLabel>
        <div class="relative mt-1">
          <ListboxButton
            class="h-9 relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            :class="{ 'border-red-300': hasError }"
          >
            <span class="block truncate capitalize">{{ displayValue }}</span>
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>
          <transition
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption
                v-for="option in options"
                :key="option.value"
                v-slot="{ active, selected }"
                :value="option.value"
                :disabled="option.disabled"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                    option.disabled ? 'opacity-50 cursor-not-allowed' : '',
                    'relative cursor-default select-none py-2 pl-3 pr-9 capitalize'
                  ]"
                >
                  <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                    {{ option.label || option.value }}
                  </span>
                  <span
                    v-if="selected"
                    :class="[
                      active ? 'text-white' : 'text-indigo-600',
                      'absolute inset-y-0 right-0 flex items-center pr-4'
                    ]"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </div>
    </Listbox>
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
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  errors: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  }
});

defineEmits(['update:modelValue']);

const hasError = computed(() => props.errors && props.errors.length > 0);

const displayValue = computed(() => {
  if (!props.modelValue) return props.placeholder;
  const option = props.options.find(opt => opt.value === props.modelValue);
  return option ? (option.label || option.value) : props.modelValue;
});

defineExpose({
  hasError
});
</script>
