<template>
    <Form v-if="campaign" :campaign="campaign" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useCampaignStore } from "@/stores/campaign";
import { useRoute } from "vue-router";
import Form from "@/views/campaigns/Form.vue";

const campaignStore = useCampaignStore();
const route = useRoute();
const campaign = ref(null);

onMounted(async () => {
  const response = await campaignStore.getCampaign(route.params.id)
  campaign.value = response.campaign;
});
</script>