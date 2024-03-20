import { IButtonsGrid } from '../button/Button'

export interface IGrid {
  children: JSX.Element;
  title: string;
  text?: string;
  buttons?: IButtonsGrid[];
  permissions?: string[];
  tooltip?: string;
}
