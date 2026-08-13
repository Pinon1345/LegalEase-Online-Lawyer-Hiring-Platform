import { roleValidator } from '@/lib/api/session';
import React from 'react';

const LawyerLayout = async ({ children }) => {

    await roleValidator("lawyer");

    return children;
};

export default LawyerLayout;