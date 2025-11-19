import { ChannelStats } from "./types";
import { MOCK_STATS } from "./constants";

// This points to the FastAPI backend
const API_BASE_URL = "http://localhost:8000/api";

export const api = {
  async getChannelStats(channelId: string): Promise<ChannelStats[]> {
    try {
      // Attempt to fetch from real python backend
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout

      const response = await fetch(`${API_BASE_URL}/stats/${encodeURIComponent(channelId)}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return await response.json();
      }
      throw new Error("Failed to fetch");
    } catch (e) {
      console.log("Backend unreachable, using mock data for demonstration.");
      return MOCK_STATS;
    }
  },

  async verifyChannel(channelName: string): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(`${API_BASE_URL}/verify/${encodeURIComponent(channelName)}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            return data.verified;
        }
        return false;
    } catch (e) {
        console.log("Backend verify unreachable, falling back to mock true.");
        // Fallback: Simulate a network delay then succeed for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true; 
    }
  }
};
