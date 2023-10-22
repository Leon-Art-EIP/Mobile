import axios from 'axios';

const instance = axios.create({
  // You can customize the axios instance here, for example, setting a base URL
  baseURL: 'http://10.0.2.2:5001/api/auth/login',
  timeout: 5000, // Set the timeout for requests
  // Add other configurations as needed
});

export default instance;
