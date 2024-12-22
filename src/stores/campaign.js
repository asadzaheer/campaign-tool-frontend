import { defineStore } from "pinia";
import { ref } from "vue";
import { campaigns } from "@/utils/api";

export const useCampaignStore = defineStore("campaign", () => {

  async function createCampaign(data) {
    try {
      await campaigns.create(data);
    } catch (error) {
      throw error;
    }
  }

  async function getCampaigns({ page = 1, search = "", status = "" } = {}) {
    try {
      const response = await campaigns.list({ page, search, status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function updateCampaign(id, data) {
    try {
      const response = await campaigns.update(id, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function getCampaign(id) {
    try {
      const response = await campaigns.get(id);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function deleteCampaign(id) {
    try {
      await campaigns.delete(id);
    } catch (error) {
      throw error;
    }
  }

  return {
    createCampaign,
    getCampaigns,
    updateCampaign,
    getCampaign,
    deleteCampaign,
  };
});
