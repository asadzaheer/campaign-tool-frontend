<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <TransitionRoot appear :show="true">
      <div class="space-y-6">
        <TransitionChild
          enter="transform transition duration-300"
          enter-from="opacity-0 translate-y-4"
          enter-to="opacity-100 translate-y-0"
          leave="transform transition duration-300"
          leave-from="opacity-100 translate-y-0"
          leave-to="opacity-0 translate-y-4"
        >
          <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">
            {{ campaign ? "Update Campaign" : "Create Campaign" }}
          </h1>
        </TransitionChild>

        <TransitionChild
          enter="transform transition duration-500 delay-100"
          enter-from="opacity-0 translate-y-4"
          enter-to="opacity-100 translate-y-0"
          leave="transform transition duration-300"
          leave-from="opacity-100 translate-y-0"
          leave-to="opacity-0 translate-y-4"
        >
          <div class="bg-white shadow sm:rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <LoadingSpinner v-if="isLoading" />

              <form @submit.prevent="submitForm" class="space-y-6">
                <FormInput
                  id="title"
                  v-model="form.title"
                  label="Title"
                  :errors="errors.title"
                  required
                />

                <FormInput
                  id="landing_page_url"
                  v-model="form.landing_page_url"
                  label="Landing Page URL"
                  type="url"
                  :errors="errors.landing_page_url"
                  required
                />

                <FormSelect
                  v-model="form.activity_status"
                  label="Status"
                  :options="[
                    { value: 'active', label: 'Active' },
                    { value: 'paused', label: 'Paused' }
                  ]"
                  :errors="errors.activity_status"
                />

                <PayoutFields
                  v-model="form.payouts"
                  :errors="errors"
                  :campaign-payouts="campaign?.payouts"
                />

                <div class="pt-4">
                  <button
                    type="submit"
                    class="w-full inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="mr-2">
                      <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    {{ campaign ? "Update Campaign" : "Create Campaign" }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </TransitionChild>
      </div>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
import { useRouter } from "vue-router";
import { useCampaignStore } from "@/stores/campaign";
import { useNotificationStore } from "@/stores/notification";
import { TransitionRoot, TransitionChild } from '@headlessui/vue';
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import PayoutFields from "@/components/campaigns/PayoutFields.vue";

const router = useRouter();
const campaignStore = useCampaignStore();
const notificationStore = useNotificationStore();

const props = defineProps({
  campaign: {
    type: Object,
    default: null,
  },
});

const form = ref({});
const errors = ref({});
const isLoading = ref(false);

const resetData = () => {
  form.value = {
    title: "",
    landing_page_url: "",
    activity_status: "active",
    payouts: [{ country: "", payout_value: "" }],
  };
  errors.value = {};
};

const setFormdata = () => {
  if (props.campaign) {
    form.value = {
      title: props.campaign.title,
      landing_page_url: props.campaign.landing_page_url,
      activity_status: props.campaign.activity_status,
      payouts: props.campaign.payouts.map((payout) => ({
        country: payout.country,
        payout_value: payout.payout_value,
      })),
    };
  } else {
    resetData();
  }
};

const submitForm = async () => {
  try {
    isLoading.value = true;
    errors.value = {};
    let message = "";

    if (form.value.payouts[0].country === "") {
      errors.value = {
        "payouts.0.country": ["The country is required."],
      };
      return;
    }

    if (props.campaign) {
      await campaignStore.updateCampaign(props.campaign.id, form.value);
      message = "Campaign updated successfully";
    } else {
      await campaignStore.createCampaign(form.value);
      message = "Campaign created successfully";
    }

    notificationStore.showNotification({
      type: "success",
      title: "Success",
      message,
    });

    router.push({ name: "campaigns" });
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    } else {
      notificationStore.showNotification({
        type: "error",
        title: "Error",
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  } finally {
    isLoading.value = false;
  }
};

setFormdata();
</script>
