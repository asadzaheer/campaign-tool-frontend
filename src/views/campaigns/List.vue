<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Search and Filter -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex space-x-4">
          <input
            type="text"
            v-model="filters.search"
            placeholder="Search campaigns..."
            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
          />
          <select
            v-model="filters.status"
            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>
        <router-link
          :to="{ name: 'campaign-create' }"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Campaign
        </router-link>
      </div>

      <!-- Campaigns List -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md relative min-h-[60px]">
        <LoadingSpinner v-if="isLoading" />

        <div v-if="campaigns.length === 0 && !isLoading" class="px-6 py-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900 text-center">
            No campaigns found.
          </h3>
        </div>

        <ul role="list" class="divide-y divide-gray-200" v-else>
          <li
            v-for="campaign in campaigns"
            :key="campaign.id"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-4">
                  <p class="text-sm font-medium text-indigo-600 truncate">
                    {{ campaign.title }}
                  </p>
                  <div class="flex-shrink-0 flex">
                    <p
                      :class="[
                        campaign.activity_status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800',
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize',
                      ]"
                    >
                      {{ campaign.activity_status }}
                    </p>
                  </div>
                </div>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Landing Page:
                    <a
                      :href="campaign.landing_page_url"
                      target="_blank"
                      class="text-indigo-600 hover:text-indigo-900"
                      >{{ campaign.landing_page_url }}</a
                    >
                  </p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span
                      v-for="payout in campaign.payouts"
                      :key="payout.id"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ payout.country }}: €{{ payout.payout_value }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="ml-4 flex items-center space-x-4">
                <button
                  @click="toggleStatus(campaign)"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white"
                  :class="
                    campaign.activity_status === 'active'
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-green-600 hover:bg-green-700'
                  "
                >
                  {{
                    campaign.activity_status === "active" ? "Pause" : "Activate"
                  }}
                </button>
                <a
                  :href="`/campaigns/${campaign.id}/edit`"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </a>
                <button
                  @click="deleteCampaign(campaign)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Pagination -->
      <div
        v-if="campaigns.length > 0"
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          >
            Previous
          </button>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            :class="{
              'opacity-50 cursor-not-allowed': currentPage === totalPages,
            }"
          >
            Next
          </button>
        </div>
        <div
          class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{
                (currentPage - 1) * perPage + 1
              }}</span>
              to
              <span class="font-medium">{{
                Math.min(currentPage * perPage, totalItems)
              }}</span>
              of
              <span class="font-medium">{{ totalItems }}</span>
              results
            </p>
          </div>
          <div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            >
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                Previous
              </button>
              <button
                v-for="page in displayedPages"
                :key="page"
                @click="changePage(page)"
                :class="[
                  page === currentPage
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="{
                  'opacity-50 cursor-not-allowed': currentPage === totalPages,
                }"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useCampaignStore } from "@/stores/campaign";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const campaignStore = useCampaignStore();
const campaigns = ref([]);
const filters = ref({
  search: "",
  status: "",
});
const currentPage = ref(1);
const perPage = ref(10);
const totalItems = ref(0);
const totalPages = ref(1);
const searchTimeout = ref(null);
const isLoading = ref(true);

const displayedPages = computed(() => {
  const pages = [];
  const maxPages = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
  let end = Math.min(totalPages.value, start + maxPages - 1);

  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const loadCampaigns = async () => {
  isLoading.value = true;

  try {
    const response = await campaignStore.getCampaigns({
      page: currentPage.value,
      search: filters.value.search,
      status: filters.value.status
    });
    campaigns.value = response.campaigns.data;
    totalItems.value = response.campaigns.total;
    totalPages.value = response.campaigns.last_page;
  } catch (error) {
    console.error('Error loading campaigns:', error);
  } finally {
    isLoading.value = false;
  }
};

let debounceTimer;
watch([filters, currentPage], () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (currentPage.value === 1) {
      loadCampaigns();
    } else {
      currentPage.value = 1;
    }
  }, 500);
}, { deep: true });

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadCampaigns();
  }
};

const toggleStatus = async (campaign) => {
  isLoading.value = true;

  try {
    const response = await campaignStore.updateCampaign(campaign.id, {
      activity_status:
        campaign.activity_status === "active" ? "paused" : "active",
    });
    campaign.activity_status = response.campaign.activity_status;
  } catch (error) {
    console.error("Error toggling status:", error);
  } finally {
    isLoading.value = false;
  }
};

const deleteCampaign = async (campaign) => {
  if (!confirm("Are you sure you want to delete this campaign?")) return;

  isLoading.value = true;

  try {
    await campaignStore.deleteCampaign(campaign.id);
    campaigns.value = campaigns.value.filter((c) => c.id !== campaign.id);
  } catch (error) {
    console.error("Error deleting campaign:", error);
  } finally {
    isLoading.value = false;
  }
};

const filterCampaigns = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1;
    loadCampaigns();
  }, 1000);
};

onMounted(() => {
  loadCampaigns();
});
</script>
