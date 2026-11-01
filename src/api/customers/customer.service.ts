import { api, type PaginatedResult } from '@/api/common';
import type { CityCustomerCount, Customer, ListCustomersParams } from './types';

const CUSTOMER_BASE_URL = '/customers';

export const customerService = {
  async getCities(): Promise<string[]> {
    const { data } = await api.get<string[]>(`${CUSTOMER_BASE_URL}/cities`);
    return data;
  },

  async getTotalByCity(): Promise<CityCustomerCount[]> {
    const { data } = await api.get<CityCustomerCount[]>(`${CUSTOMER_BASE_URL}/total-by-city`);
    return data;
  },

  async getPaginated(params: ListCustomersParams = {}): Promise<PaginatedResult<Customer>> {
    const { data } = await api.post<PaginatedResult<Customer>>(
      `${CUSTOMER_BASE_URL}/search`,
      params
    );

    return data;
  },
};
