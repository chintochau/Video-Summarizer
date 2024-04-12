// QuotaContext.js

import React, { createContext, useContext, useState } from 'react';
import QuotaService from '@/services/QuotaService';

const QuotaContext = createContext();

export const QuotaProvider = ({ children }) => {
  const [quota, setQuota] = useState(QuotaService.getQuota());

  const value = {
    quota,setQuota
  };

  return (
    <QuotaContext.Provider value={value}>
      {children}
    </QuotaContext.Provider>
  );
};

export const useQuota = () => useContext(QuotaContext);
