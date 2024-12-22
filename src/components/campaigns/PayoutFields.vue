<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">Payouts</label>
    <TransitionGroup tag="div" class="space-y-4">
      <template v-for="(payout, index) in localPayouts" :key="index">
        <div class="flex gap-4 items-start">
          <div class="flex-1">
            <FormSelect
              v-model="payout.country"
              label="Country"
              :options="getAvailableCountries(index)"
              :errors="getErrors(`payouts.${index}.country`)"
              placeholder="Select Country"
              @update:model-value="updatePayout(index, 'country', $event)"
            />
          </div>

          <div class="flex-1">
            <FormInput
              :id="`payout-value-${index}`"
              v-model="payout.payout_value"
              label="Payout Value"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter value"
              :errors="getErrors(`payouts.${index}.payout_value`)"
              @update:model-value="updatePayout(index, 'payout_value', $event)"
              required
            />
          </div>

          <button
            v-if="localPayouts.length > 1"
            type="button"
            @click="removePayout(index)"
            class="mt-8 inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <XMarkIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </template>
    </TransitionGroup>

    <div class="mt-4 flex justify-between items-center">
      <button
        v-if="localPayouts.length < 3"
        type="button"
        @click="addPayout"
        class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusIcon class="h-5 w-5 mr-1" aria-hidden="true" />
        Add Payout
      </button>
      <p v-if="errors.payouts" class="text-sm text-red-600">
        {{ errors.payouts[0] }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { XMarkIcon, PlusIcon } from '@heroicons/vue/20/solid';
import FormSelect from '@/components/form/FormSelect.vue';
import FormInput from '@/components/form/FormInput.vue';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  campaignPayouts: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const localPayouts = ref([...props.modelValue]);

watch(() => props.modelValue, (newValue) => {
  localPayouts.value = [...newValue];
}, { deep: true });

const getAvailableCountries = (currentIndex) => {
  const selectedCountries = localPayouts.value
    .map((payout, index) => (index !== currentIndex ? payout.country : null))
    .filter(Boolean);
  
  const campaignCountries = props.campaignPayouts?.map((payout) => payout.country) || [];
  
  return ["estonia", "spain", "bulgaria"].map((country) => ({
    value: country,
    label: country.charAt(0).toUpperCase() + country.slice(1),
    disabled: selectedCountries.includes(country) && !campaignCountries.includes(country)
  }));
};

const getErrors = (path) => {
  return props.errors[path] || [];
};

const updatePayout = (index, field, value) => {
  localPayouts.value[index][field] = value;
  emit('update:modelValue', [...localPayouts.value]);
};

const addPayout = () => {
  localPayouts.value.push({ country: '', payout_value: '' });
  emit('update:modelValue', [...localPayouts.value]);
};

const removePayout = (index) => {
  localPayouts.value.splice(index, 1);
  emit('update:modelValue', [...localPayouts.value]);
};
</script>
