import axios from 'axios';
import { Launch, Launchpad } from '../api/types';

const API_V5 = 'https://api.spacexdata.com/v5';
const API_V4 = 'https://api.spacexdata.com/v4';

export const getLaunches = async (page: number, limit: number): Promise<Launch[]> => {
  try {
    const response = await axios.post(`${API_V5}/launches/query`, {
      options: {
        page,
        limit,
        populate: [
          {
            path: 'launchpad',
            select: 'name full_name localities region timezone latitude longitude'
          }
        ]
      }
    });
    return response.data.docs;
  } catch (error) {
    console.error('Failed to fetch launches:', error);
    throw error;
  }
};

/**
 * Fetches detailed information for a single launchpad by its ID.
 * This is useful if you only need launchpad details for a specific ID later on.
 */
export const getLaunchpadById = async (id: string): Promise<Launchpad> => {
  try {
    const response = await axios.get(`${API_V4}/launchpads/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch launchpad with ID ${id}:`, error);
    throw error;
  }
};