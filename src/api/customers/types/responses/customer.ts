import type { IAudited, IEntity } from '@/api/common';

export interface Customer extends IEntity, IAudited {
  firstName: string;
  lastName: string;
  email: string;
  gender: string | null;
  company: string | null;
  city: string;
  title: string | null;
}
