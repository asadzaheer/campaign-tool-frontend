<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Search and Filter -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex space-x-4">
          <div class="relative">
            <input
              type="text"
              v-model="filters.search"
              placeholder="Search campaigns..."
              class="w-64 h-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed pl-10"
              :disabled="isLoading"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
          
          <Listbox v-model="filters.status" as="div" class="relative">
            <ListboxButton
              class="min-w-[200px] relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
              :disabled="isLoading"
            >
              <span class="block truncate">{{ filters.status ? filters.status.charAt(0).toUpperCase() + filters.status.slice(1) : 'All Status' }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  v-slot="{ active, selected }"
                  :value="''"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-3 pr-9'
                    ]"
                  >
                    <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                      All Status
                    </span>
                    <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
                <ListboxOption
                  v-for="status in ['active', 'paused']"
                  :key="status"
                  v-slot="{ active, selected }"
                  :value="status"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-3 pr-9'
                    ]"
                  >
                    <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                      {{ status.charAt(0).toUpperCase() + status.slice(1) }}
                    </span>
                    <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </Listbox>
        </div>

        <router-link
          :to="{ name: 'campaign-create' }"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon class="h-5 w-5 mr-2" aria-hidden="true" />
          Create Campaign
        </router-link>
      </div>

      <!-- Campaigns List -->
      <TransitionRoot
        appear
        :show="true"
        as="div"
        class="bg-white shadow overflow-unset sm:rounded-md relative min-h-[60px]"
      >
        <LoadingSpinner v-if="isLoading" />

        <div v-if="campaigns.length === 0 && !isLoading" class="px-6 py-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900 text-center">
            No campaigns found.
          </h3>
        </div>

        <TransitionGroup tag="ul" class="divide-y divide-gray-200">
          <template v-for="campaign in campaigns" :key="campaign.id">
            <li
              class="px-6 py-4 hover:bg-gray-50 transition-colors duration-150 list-none"
            >
              <div class="flex items-center">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-4">
                    <p class="text-sm font-medium text-indigo-600 truncate">
                      {{ campaign.title }}
                    </p>
                    <Badge
                      :class="[
                        campaign.activity_status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      ]"
                    >
                      {{ campaign.activity_status }}
                    </Badge>
                  </div>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Landing Page:
                      <a
                        :href="campaign.landing_page_url"
                        target="_blank"
                        class="text-indigo-600 hover:text-indigo-900"
                      >{{ campaign.landing_page_url }}</a>
                    </p>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <Badge
                        v-for="payout in campaign.payouts"
                        :key="payout.id"
                        class="bg-blue-100 text-blue-800"
                      >
                        {{ payout.country }}: €{{ payout.payout_value }}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div class="ml-4 flex items-center space-x-4">
                  <Menu as="div" class="relative">
                    <MenuButton
                      class="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Actions
                      <ChevronDownIcon class="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                    </MenuButton>
                    <transition
                      enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95"
                      enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95"
                    >
                      <MenuItems
                        class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      >
                        <div class="py-1">
                          <MenuItem v-slot="{ active }">
                            <button
                              @click="toggleStatus(campaign)"
                              :class="[
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block w-full text-left px-4 py-2 text-sm'
                              ]"
                            >
                              {{ campaign.activity_status === 'active' ? 'Pause' : 'Activate' }}
                            </button>
                          </MenuItem>
                          <MenuItem v-slot="{ active }">
                            <a
                              :href="`/campaigns/${campaign.id}/edit`"
                              :class="[
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              ]"
                            >
                              Edit
                            </a>
                          </MenuItem>
                          <MenuItem v-slot="{ active }">
                            <button
                              @click="deleteCampaign(campaign)"
                              :class="[
                                active ? 'bg-gray-100 text-red-900' : 'text-red-700',
                                'block w-full text-left px-4 py-2 text-sm'
                              ]"
                            >
                              Delete
                            </button>
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </transition>
                  </Menu>
                </div>
              </div>
            </li>
          </template>
        </TransitionGroup>
      </TransitionRoot>

      <!-- Pagination -->
      <div
        v-if="campaigns.length > 0"
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          >
            Previous
          </button>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(currentPage * perPage, totalItems) }}</span>
              of
              <span class="font-medium">{{ totalItems }}</span>
              results
            </p>
          </div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              v-for="page in displayedPages"
              :key="page"
              @click="changePage(page)"
              :class="[
                page === currentPage
                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            >
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, TransitionGroup } from "vue";
import { useCampaignStore } from "@/stores/campaign";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  TransitionRoot,
} from '@headlessui/vue';
import {
  ChevronUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from '@heroicons/vue/20/solid';
import Badge from '@/components/Badge.vue';
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const campaignStore = useCampaignStore();
const campaigns = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const perPage = ref(10);

const filters = ref({
  search: "",
  status: "",
});

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
watch(filters, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    currentPage.value = 1; // Reset to page 1 only when filters change
    loadCampaigns();
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

onMounted(() => {
  loadCampaigns();
});
</script>
