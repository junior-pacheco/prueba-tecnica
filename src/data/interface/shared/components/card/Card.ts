export interface ICard {
  key: number;
  title?: string;
  subtitle?: string;
  description?: string;
  editAction?: () => void;
  deleteAction?: () => void;
}
