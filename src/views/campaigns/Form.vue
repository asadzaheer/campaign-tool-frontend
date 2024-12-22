<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">
      {{ campaign ? "Update Campaign" : "Create Campaign" }}
    </h1>
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <LoadingSpinner v-if="isLoading" />

        <form @submit.prevent="submitForm">
          <!-- Title -->
          <div class="mb-4">
            <label for="title" class="block font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              v-model="form.title"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:"
              required
            />
            <ul v-if="hasError('title')">
              <li
                v-for="(error, index) in errors.title"
                :key="index"
                class="mt-2 text-sm text-red-600"
              >
                {{ error }}
              </li>
            </ul>
          </div>

          <!-- Landing Page URL -->
          <div class="mb-4">
            <label
              for="landing_page_url"
              class="block font-medium text-gray-700"
            >
              Landing Page URL
            </label>
            <input
              type="url"
              id="landing_page_url"
              v-model="form.landing_page_url"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            <ul v-if="hasError('landing_page_url')">
              <li
                v-for="(error, index) in errors.landing_page_url"
                :key="index"
                class="mt-2 text-sm text-red-600"
              >
                {{ error }}
              </li>
            </ul>
          </div>

          <!-- Activity Status -->
          <div class="mb-4">
            <label
              for="activity_status"
              class="block font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="activity_status"
              v-model="form.activity_status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
            <ul v-if="hasError('activity_status')">
              <li
                v-for="(error, index) in errors.activity_status"
                :key="index"
                class="mt-2 text-sm text-red-600"
              >
                {{ error }}
              </li>
            </ul>
          </div>

          <!-- Payouts -->
          <div class="mb-4">
            <label class="block font-medium text-gray-700 mb-2">Payouts</label>
            <div
              v-for="(payout, index) in form.payouts"
              :key="index"
              class="flex gap-4 first-line:mb-2"
            >
              <div class="flex-1">
                <select
                  v-model="payout.country"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm capitalize"
                  required
                >
                  <option value="" disabled>Select Country</option>
                  <option
                    v-for="country in getAvailableCountries(index)"
                    :key="country.value"
                    :value="country.value"
                    :disabled="country.disabled"
                    class="capitalize"
                  >
                    {{ country.value }}
                  </option>
                </select>
                <ul v-if="hasError(`payouts.${index}.country`)">
                  <li
                    v-for="(error, index) in errors[`payouts.${index}.country`]"
                    :key="index"
                    class="mt-2 text-sm text-red-600"
                  >
                    {{ error }}
                  </li>
                </ul>
              </div>
              <div class="flex-1">
                <input
                  type="number"
                  v-model="payout.payout_value"
                  step="0.01"
                  min="0"
                  placeholder="Payout Value"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
                <ul v-if="hasError(`payouts.${index}.payout_value`)">
                  <li
                    v-for="(error, index) in errors[`payouts.${index}.payout_value`]"
                    :key="index"
                    class="mt-2 text-sm text-red-600"
                  >
                    {{ error }}
                  </li>
                </ul>
              </div>
              <button
                v-if="form.payouts.length > 1"
                type="button"
                @click="removePayout(index)"
                class="inline-flex text-sm items-center px-3 py-2 border border-transparent leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
            <button
              v-if="form.payouts.length < 3"
              type="button"
              @click="addPayout"
              class="mt-2 inline-flex items-center px-4 py-2 border border-transparent font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Payout
            </button>
            <p v-if="errors.payouts" class="mt-2 text-sm text-red-600">
              {{ errors.payouts[0] }}
            </p>
          </div>

          <!-- Submit Button -->
          <div class="mt-6">
            <button
              type="submit"
              class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {{ campaign ? "Update Campaign" : "Create Campaign" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useRouter } from "vue-router";
import { useCampaignStore } from "@/stores/campaign";
import { useNotificationStore } from "@/stores/notification";

const router = useRouter();
const campaignStore = useCampaignStore();
const notificationStore = useNotificationStore();

const props = defineProps({
  campaign: {
    type: Object,
    default: null,
  },
});

const getAvailableCountries = (currentIndex) => {
  console.log("getAvailableCountries");
  const selectedCountries = form.value.payouts
    .map((payout, index) => (index !== currentIndex ? payout.country : null))
    .filter(Boolean);
  console.log("selectedCountries", selectedCountries);
  const campaignCountries =
    props.campaign?.payouts?.map((payout) => payout.country) || [];
  console.log("campaignCountries", campaignCountries);
  return ["estonia", "spain", "bulgaria"].map((country) => ({
    value: country,
    disabled:
      selectedCountries.includes(country) ||
      campaignCountries.includes(country),
  }));
};

console.log("props.campaign", props.campaign);

const form = ref({});
const errors = ref({});
const isLoading = ref(false);
const notification = ref({
  show: false,
  type: "success",
  title: "",
  message: "",
});

const addPayout = () => {
  if (form.value.payouts.length === 3) {
    return;
  }

  form.value.payouts.push({ country: "", payout_value: "" });
};

const removePayout = (index) => {
  if (form.value.payouts.length > 1) {
    form.value.payouts.splice(index, 1);
  }
};

const submitForm = async () => {
  isLoading.value = true;
  errors.value = {};

  try {
    props.campaign
      ? await campaignStore.updateCampaign(props.campaign.id, form.value)
      : await campaignStore.createCampaign(form.value);

    notificationStore.showNotification({
      type: "success",
      title: "Success",
      message: `Campaign ${
        props.campaign ? "updated" : "created"
      } successfully!`,
    });

    resetData();
    router.push({ name: "campaigns" });
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
      return;
    }

    console.error("Error submitting form:", error);
    notificationStore.showNotification({
      type: "error",
      title: "Error",
      message: error.response?.data?.message || "Something went wrong",
    });
  } finally {
    isLoading.value = false;
  }
};

const resetData = () => {
  setFormdata();
  errors.value = {};
};

const setFormdata = () => {
  form.value = {
    title: props.campaign?.title || "",
    landing_page_url: props.campaign?.landing_page_url || "",
    activity_status: props.campaign?.activity_status || "active",
    payouts: props.campaign?.payouts.map((payout) => ({
      country: payout.country,
      payout_value: payout.payout_value,
    })) || [{ country: "", payout_value: "" }],
  };
};

setFormdata();

const hasError = (field) => {
  return errors.value[field] !== undefined;
};
</script>
