import { RouteId } from '../../types';

export type AdminTab =
  | 'overview'
  | 'profile'
  | 'git'
  | 'work'
  | 'lab-notes'
  | 'talks'
  | 'experience'
  | 'about'
  | 'contact'
  | 'backup';

export interface AdminTabBaseProps {
  showToast: (message: string) => void;
  onNavigateTab: (tab: AdminTab) => void;
  onNavigateSite: (route: RouteId) => void;
}
