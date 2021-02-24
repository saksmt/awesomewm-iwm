import { xresources } from 'beautiful';

const dpi = xresources.apply_dpi;

export const panelHeight = dpi(30);
export const systrayMargin = dpi(4);
export const systrayIconSize = panelHeight - systrayMargin * 2;
