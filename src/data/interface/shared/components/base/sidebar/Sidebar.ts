import { Dispatch, ReactNode, SetStateAction } from 'react'

export interface ISidebarOption {
  href: string;
  name: string;
  icon?: ReactNode;
  closeNavbar?: boolean;
  permission?: string
}

export interface ISidebar {
  options: ISidebarOption[];
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>
}
