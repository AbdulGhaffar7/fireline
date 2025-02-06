import { base_url } from ".";
import axios from "axios";

export async function getIncidents() {
  try {
    const response = await axios.get(`${base_url}/api/fire-incidents/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching incidents:", error);
    throw error;
  }
}
export async function getIncidentById(id) {
  try {
    const response = await axios.get(`${base_url}/api/fire-incidents/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching incident by id:", error);
    throw error;
  }
}

export async function uploadIncident(incident) {
  try {
    const response = await axios.post(
      `${base_url}/api/fire-incidents/`,
      incident
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading incident:", error);
    throw error;
  }
}

export async function deleteIncident(id) {
  try {
    const response = await axios.delete(`${base_url}/api/fire-incidents/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting incident:", error);
    throw error;
  }
}

export async function updateIncident(id, updatedIncident) {
  try {
    const response = await axios.put(
      `${base_url}/api/fire-incidents/${id}`,
      updatedIncident
    );
    return response.data;
  } catch (error) {
    console.error("Error updating incident:", error);
    throw error;
  }
}
