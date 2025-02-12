import axios from "axios";
import { API_URL } from "../config";

export const fetchStartingPoints = async () => {
    try {
        const response = await axios.get(`${API_URL}/Driver/get-starting-points`);
        return response.data;
    }
    catch (error) {
        console.error ('Error fetching starting points', error);
        throw error;
    }
};

export const fetchDestinationLocations = async () => {
    try {
        const response = await axios.get (`${API_URL}/Driver/get-destination-location`);
        return response.data;
    }
    catch (error) {
        console.error ('Error fetching destination location', error);
        throw error;
    }
};


// Function to apply as a driver
export const applyForDriver = async (driverData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User is not authorized.");
      alert("Session expired. Please log in again.");
      return;
    }

    // Log driverData to see if files are being passed correctly
    //console.log("Driver Data Received:", driverData);

    // Match the case with how files are stored in the form state
    //console.log("Driver Data License Photo:", driverData.get('LicensePhoto')); // Changed from licensePhoto to LicensePhoto

    // Check for missing files using the correct case
    if (
      !driverData.get('LicensePhoto') ||
      !driverData.get('DriverPhoto') ||
      !driverData.get('BillbookPhoto') ||
      !driverData.get('CitizenshipFront') ||
      !driverData.get('CitizenshipBack') ||
      !driverData.get('SelfieWithID')
    ) {
      console.error("Missing required files:", driverData);
      alert("All file uploads are required. Please upload all necessary files.");
      return;
    }


    // Debugging: Log formData to ensure all fields and files are included
    // console.log("Submitting driver application...");
    // for (let pair of driverData.entries()) {
    //   console.log(pair[0], pair[1]); // Log key-value pairs
    // }

    const response = await axios.post(
      `${API_URL}/Driver/apply-for-driver`,
      driverData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Response from server:", response.data);
    return response.data;
  } catch (error) {
    console.error("Driver application error:", error);
    let errorMessage =
      error.response?.data?.message || error.response?.data || error.message || "An unknown error occurred";

    alert(`Application failed: ${errorMessage}`);
    throw errorMessage;
  }
};

export const allDriverApplications = async (page = 1, pageSize = 5) => {
  try {
    // Send pagination parameters (page and pageSize) in the request
    const response = await axios.get(`${API_URL}/Driver/all-driver-applications`, {
      params: {
        page: page,
        pageSize: pageSize
      }
    });
    return response.data; // This will include the paginated data and total count
  } catch (error) {
    console.error("Error fetching driver applications", error);
    throw error; // Rethrow the error so it can be handled later if needed
  }
};

export const singleDriverApplication = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/Driver/single-driver-application/${id}`);
    console.log ("Response",response);
    return response.data;
  } catch (error) {
    console.error("Error while fetching single driver application", error);
    throw error;
  }
};