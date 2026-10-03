import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const BusinessContext = createContext(null);

export function BusinessProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null); // null = All Channels
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    api.get('/businesses')
      .then((res) => {
        const list = res.data.businesses || [];
        setBusinesses(list);
        if (list.length > 0) {
          setSelectedBusiness(list[0]);
        }
      })
      .catch((err) => {
        console.error('Failed to load businesses:', err);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  return (
    <BusinessContext.Provider value={{
      businesses,
      selectedBusiness,
      selectedPage,
      setSelectedBusiness,
      setSelectedPage,
      loading
    }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error('useBusiness must be used within a BusinessProvider');
  return ctx;
}
