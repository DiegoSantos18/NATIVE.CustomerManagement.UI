import { api, type PaginatedResult } from '@/api/common';
import type { CityCustomerCount, Customer, ListCustomersParams, UpdateCustomerData } from './types';

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

  async getPaginated(
    params: ListCustomersParams = { pagination: { page: 1, pageSize: 10 } }
  ): Promise<PaginatedResult<Customer>> {
    const { data } = await api.post<PaginatedResult<Customer>>(
      `${CUSTOMER_BASE_URL}/search`,
      params
    );
    return data;
  },

  async getById(id: number | string): Promise<Customer> {
    const { data } = await api.get<Customer>(`${CUSTOMER_BASE_URL}/${id}`);
    return data;
  },

  async update(id: number | string, customerData: UpdateCustomerData): Promise<Customer> {
    const { data } = await api.put<Customer>(`${CUSTOMER_BASE_URL}/${id}`, customerData);
    return data;
  },
};
