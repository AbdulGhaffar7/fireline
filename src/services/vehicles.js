import { base_url } from ".";
import axios from "axios";

export async function getVehicles() {
  try {
    const response = await axios.get(`${base_url}/api/vehicles/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
}

export async function uploadVehicle(vehicle) {
  try {
    const response = await axios.post(`${base_url}/api/vehicles/`, vehicle);
    return response.data;
  } catch (error) {
    console.error("Error uploading vehicle:", error);
    throw error;
  }
}

export async function deleteVehicle(id) {
  try {
    const response = await axios.delete(`${base_url}/api/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw error;
  }
}

export async function updateVehicle(id, updatedVehicle) {
  try {
    const response = await axios.put(
      `${base_url}/api/vehicles/${id}`,
      updatedVehicle
    );
    return response.data;
  } catch (error) {
    console.error("Error updating vehicle:", error);
    throw error;
  }
}
