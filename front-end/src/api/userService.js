import axios from "axios";

const API_URL = "http://localhost:8080/api/users"; // Update with your back-end URL


export const loginUser = async (username, password) => {
    const response = await axios.post(`${API_URL}/login`, null, {
      params: { username, password },
    });
    return response.data;
  };
  
  export const verifyOtp = async (username, password, otp) => {
    const response = await axios.post(`${API_URL}/verify-otp`, {
      username,
      password,
      otp,
    });
    return response.data;
  };

export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/allusers`);
  return response.data;
};




// Function to add a new admin
export const addNewAdmin = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data; // Return the response from the back-end (e.g., success message or created user)
    } catch (error) {
      console.error("Error registering user:", error);
      throw error; // Propagate the error for further handling
    }
  };
