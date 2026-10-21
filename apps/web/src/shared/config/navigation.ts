import type { LinkProps } from '@tanstack/react-router';

export interface NavItem {
  label: string;
  to: NonNullable<LinkProps['to']>;
}

export const NAV_ITEMS: NavItem[] = [{ label: 'Home', to: '/' }];
