export interface IDialog {
  title: string;
  content: string;
  showSecondaryButton?: boolean;
  titlePrimaryButton?: string
  titleSecondaryButton?: string
  open: boolean;
  primaryOnClick?: () => void;
  secondaryOnClick?: () => void;
}
