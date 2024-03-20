export interface IRestricted {
  permissions: string[];
  required: string;
  redirect?: boolean;
  destination?: string;
  children?: any;
}
