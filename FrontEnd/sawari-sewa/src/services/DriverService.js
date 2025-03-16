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

// Function to check if the user has a pending driver application
export const checkDriverApplicationStatus = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const response = await axios.get(`${API_URL}/Driver/check-application-status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.hasPendingApplication; // Expecting a boolean response from API
  } catch (error) {
    console.error("Error checking driver application status:", error);
    return false;
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

export const approvedDriversList = async (page = 1, pageSize =5) => {
  try {
    const response = await axios.get(`${API_URL}/Driver/all-approved-drivers`, {
      params: {
        page : page,
        pageSize : pageSize
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error while fetching approved drivers list", error);
    throw error;
  }
}

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

export const viewApprovedDriver = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/Driver/single-approved-driver/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while view approved driver ", error);
    throw error;
  }
};

export const totalApplicationCount = async() => {
  try {
    const response = await axios.get(`${API_URL}/Driver/driver-count`);
    return response.data.totalApplications;
  } catch (error) {
    console.error("Error while fetching total count of driver applications", error);
    throw error;
  }
};

export const totalApprovedDriversCount = async() => {
  try {
  const response = await axios.get(`${API_URL}/Driver/driver-count`);
  return response.data.approvedDrivers;
  } catch (error) {
    console.error("Error while fetching the approved drivers ", error);
    throw error;
  }
};

export const approveDriverApplication = async(id) => {
  try{
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found. User is not authorized");
      alert("Session expired. Please log in again");
      return;
    }
    const response = await axios.post(
      `${API_URL}/Driver/approve-driver/${id}`,
      {},
      {
        headers: {
          Authorization:`Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to approve the driver application", error);
    let errorMessage = error.response?.data?.message || error.response?.data || error.message || "An unknown error occurred";
    alert("Approval failed: ",errorMessage);
    throw errorMessage;
  }
}

export const rejectDriverApplication = async(id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in");
      return;
    }
    const response = await axios.post(`${API_URL}/Driver/reject-driver/${id}`,
      {},
      {
        headers: {
          Authorization:`Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to reject the driver application", error);
    let errorMessage = error.response?.data?.message || error.response?.data || error.message || "An unknown error occurred";
    //alert("Approval failed: ",errorMessage);
    throw errorMessage;
  }
};

export const fetchVehicleType = async () => {
  const token = localStorage.getItem("token");
  if(!token) {
    alert("Session expired. Please login again");
    return;
  }
  try {
    const response = await axios.get(`${API_URL}/Driver/get-vehicle-type`,{
      headers : {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error){
    console.log("Error while fetching the vehicle type: ",error);
    throw error.response?.data?.message || "Failed to fetch vehicle type.";
  }
};



export const setDriverOnlineStatus = async (isOnline) => {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  if (!token) {
    alert("Session expired. Please login again.");
    return;
  }

  try {
    const response = await axios.post(
      `${API_URL}/Driver/set-online-status`, 
      isOnline, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log(response.data.message); // This will log the response, e.g., "Driver is now Online"
    return response.data;
  } catch (error) {
    console.error("Error while updating driver status:", error);
    throw error.response?.data?.message || "Failed to update driver status.";
  }
};

export const fetchDriverStatus = async (driverId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Session expired. Please login again");
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/Driver/driver-status/${driverId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error while fetching the driver status: ", error);
    throw error.response?.data?.message || "Failed to fetch driver status.";
  }
};

