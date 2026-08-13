import { roleValidator } from '@/lib/api/session';
import React from 'react';

const ClientLayout = async ({ children }) => {

    await roleValidator("client");

    return children
};

export default ClientLayout;