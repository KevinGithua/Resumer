
"use client"

import AdminView from '@/components/AdminView';
import { Suspense } from 'react';

const AdminPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <AdminView />
  </Suspense>
);

export default AdminPage;
