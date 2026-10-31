import type { CityCustomerCount } from '@/api/customers';

/**
 * Separa a string de localização no formato "Cidade, UF" de forma segura.
 */
export function getCityAndState(fullCity: string) {
  const parts = fullCity.split(',').map((part) => part.trim());
  const state = parts.length > 1 ? (parts.at(-1) ?? '') : '';
  const city = parts.length > 1 ? parts.slice(0, -1).join(', ') : fullCity;

  return { city, state };
}

/**
 * Processa todos os cálculos analíticos e métricas do dashboard a partir da lista de cidades.
 */
export function calculateDashboardMetrics(cities: CityCustomerCount[]) {
  const totalCustomers = cities.reduce((total, item) => total + item.customersTotal, 0);
  const totalCities = cities.length;

  // Mapeamento dos estados únicos extraídos via tratamento da string "Cidade, UF"
  const uniqueStatesMap = new Map<string, number>();
  cities.forEach((item) => {
    const { state } = getCityAndState(item.city);
    if (state) {
      uniqueStatesMap.set(state, (uniqueStatesMap.get(state) || 0) + 1);
    }
  });

  const totalStates = uniqueStatesMap.size;

  // 1. Média do Card 1: Alcance global combinando entidades geográficas (Cidades + Estados)
  const totalRegions = totalCities + totalStates;
  const avgGeneralReach = totalRegions > 0 ? totalCustomers / totalRegions : 0;

  // 2. Média do Card 2: Clientes por Cidade (Total de Clientes / Total de Cidades)
  const avgCustomersPerCity = totalCities > 0 ? totalCustomers / totalCities : 0;

  // 3. Média do Card 3: Clientes por Estado (Total de Clientes / Total de Estados)
  const avgCustomersPerState = totalStates > 0 ? totalCustomers / totalStates : 0;

  // Tipagem estrita 'up' | 'down' para as tendências de negócio
  const customerTrend: 'up' | 'down' = avgGeneralReach >= 10 ? 'up' : 'down';
  const citiesTrend: 'up' | 'down' = avgCustomersPerCity >= 15 ? 'up' : 'down';
  const stateTrend: 'up' | 'down' = avgCustomersPerState >= 25 ? 'up' : 'down';

  const maxCustomersByCity = Math.max(...cities.map((item) => item.customersTotal), 1);

  return {
    totalCustomers,
    totalCities,
    totalStates,
    avgGeneralReach,
    avgCustomersPerCity,
    avgCustomersPerState,
    customerTrend,
    citiesTrend,
    stateTrend,
    maxCustomersByCity,
  };
}
