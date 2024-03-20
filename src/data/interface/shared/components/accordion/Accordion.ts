import { IMakeProps } from '@components/global/page-constructor/interfaces/make-props.interface'
import { IElement } from '@interfaces/model/page/Element'

export type IAccordionVariant = 'light' | 'shadow' | 'bordered' | 'splitted';

export interface IAccordion extends Pick<IElement, 'elementId' | 'elementVariant' | 'elementContent' | 'elementStyles'>, IMakeProps {
  pageId: string;
  sectionId: string;
  containerId: string;
}
