import axios from "axios";

const testBackend = async () => {
  const response = await axios.get("http://localhost:5000/test");
  return response.data;
};

export default testBackend;