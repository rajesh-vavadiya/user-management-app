'use client';
import axios from "axios";
export const fetchUsers = async ({ queryKey }) => {
  const [key, page] = queryKey;
  
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=5`
  );
  
  // Get the total count from the response headers (if available)
  const totalCount = response.headers['x-total-count'] || 0;
  
  return { users: response.data, totalCount };
};
