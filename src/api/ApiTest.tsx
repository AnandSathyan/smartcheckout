import React from 'react';
import { useApi } from './useApi';

interface User {
  id: number;
  name: string;
  email: string;
}

export function UserList() {
  // Fetch data from the /api endpoint
  const { data, isLoading, error, refetch } = useApi<{ users: string[] }>('/api');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={refetch}>Try again</button>
      </div>
    );
  }

  return (
    <div>
      <h1>User List:  -</h1>
      <div>
        {data?.users.map((user, index) => (
          <div key={index}>{user}</div>
        ))}
      </div>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
