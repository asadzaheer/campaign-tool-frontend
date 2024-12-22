import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useCampaignStore = defineStore("campaign", () => {

  async function createCampaign(data) {
    try {
      await axios.post("/api/campaigns", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async function getCampaigns({ page = 1, search = "", status = "" } = {}) {
    try {
      const response = await axios.get("/api/campaigns", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page,
          search,
          status,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function updateCampaign(id, data) {
    try {
      const response = await axios.put(`/api/campaigns/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function getCampaign(id) {
    try {
      const response = await axios.get(`/api/campaigns/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function deleteCampaign(id) {
    try {
      await axios.delete(`/api/campaigns/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
