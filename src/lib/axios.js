import axios from "axios";

const instance = axios.create({
  baseURL: 'https://us-central1-tripadvisor-clone-432ea.cloudfunctions.net/api'
  // baseURL: 'http://localhost:5001/tripadvisor-clone-432ea/us-central1/api'
});

export default instance;