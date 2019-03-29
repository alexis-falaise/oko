import { Item } from '@models/item.model';

export class ItemSize {
    label: string;
    description: string;
    icon: string;
    width?: number;
    height?: number;
    depth?: number;
    id: number;
    selected: boolean;
    selectable: boolean;
    visible: boolean;
    constructor(itemSize: Partial<ItemSize>) {
      Object.assign(this, itemSize);
    }
}

export const itemSizes = [
    new ItemSize({
      label: 'Petit',
      description: 'Lettre, Livre, portefeuille...',
      icon: 'mail_outline',
      width: 11,
      height: 16,
      depth: 5,
      id: 1,
      selected: true,
      selectable: true,
      visible: true,
    }),
    new ItemSize({
      label: 'Moyen',
      description: 'Vêtements, appareils électroniques...',
      icon: 'phonelink',
      width: 24,
      height: 19,
      depth: 10,
      id: 2,
      selected: false,
      selectable: true,
      visible: true,
    }),
    new ItemSize({
      label: 'Grand',
      description: 'Console de jeux...',
      icon: 'videogame_asset',
      width: 37.5,
      height: 25,
      depth: 15,
      id: 3,
      selected: false,
      selectable: true,
      visible: true,
    }),
    new ItemSize({
      label: 'Volumineux',
      description: 'Taille supérieure à un bagage classique',
      icon: 'tv',
      width: 75,
      height: 50,
      depth: 32,
      id: 4,
      selected: false,
      selectable: true,
      visible: true,
    }),
    new ItemSize({
      label: 'Taille non définie',
      description: 'L\'auteur n\'a pas indiqué de dimensions',
      icon: 'help_outline',
      width: 50,
      height: 50,
      depth: 50,
      id: 5,
      selected: false,
      selectable: false,
      visible: false,
    })
];

export function itemSizeFit(item: Item): ItemSize {
  let sizeIndex = null;
  if (item && item.height && item.width || item.depth) {
    const itemGlobalSize = item.height + item.width + item.depth;
    itemSizes.forEach((size, index) => {
      const globalSize = size.height + size.width + size.depth;
      if (itemGlobalSize <= globalSize && sizeIndex === null) {
        sizeIndex = index;
      }
    });
  } else {
    sizeIndex = 4;
  }
  return itemSizes[sizeIndex];
}
