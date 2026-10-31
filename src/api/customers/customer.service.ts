import { api } from '@/api/common';
import type { CityCustomerCount } from './types';

const CUSTOMER_BASE_URL = '/customers';
export const customerService = {
  async getTotalByCity(): Promise<CityCustomerCount[]> {
    const { data } = await api.get<CityCustomerCount[]>(`${CUSTOMER_BASE_URL}/total-by-city`);

    return data;
  },
};
