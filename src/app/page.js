'use client';
import UserTable from '../app/users/page';

export default function Home() {
  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-bold mb-4">User Management Table</h1>
      <UserTable/>
    </div>
  );
}
