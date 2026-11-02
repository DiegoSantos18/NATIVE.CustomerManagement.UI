import type { IAudited, IEntity } from '@/api/common/types';

export interface Customer extends IEntity, IAudited {
  firstName: string;
  lastName: string;
  email: string;
  gender: string | null;
  company: string | null;
  city: string;
  title: string | null;
}
