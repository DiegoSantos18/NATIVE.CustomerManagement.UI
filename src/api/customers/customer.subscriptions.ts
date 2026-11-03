import { getSocket } from '@/api/common';

type CustomerSocketEvents = {
  'customer:updated': (payload: { customerId: number }) => void;
};

export function subscribeToCustomerUpdates(onCustomerUpdated: () => void): () => void {
  const socket = getSocket<CustomerSocketEvents>();
  const handleCustomerUpdated = () => onCustomerUpdated();

  socket.on('customer:updated', handleCustomerUpdated);

  return () => {
    socket.off('customer:updated', handleCustomerUpdated);
  };
}
