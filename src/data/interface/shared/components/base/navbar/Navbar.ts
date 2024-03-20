import { NextRouter } from 'next/router'

export interface INavbarOption {
  href?: string;
  name: string;
  back?: boolean;
  permission?: string;
}

export interface INavbar {
  options?: INavbarOption[];
}

export interface INavbarItem {
  option: INavbarOption;
  router: NextRouter;
}
