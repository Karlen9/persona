import type {Access, FieldAccess} from 'payload';

export type TUserRole = 'admin' | 'editor';

// Accepts any auth user shape (server User or ClientUser); the role is checked structurally.
export const isAdminUser = (user: object | null | undefined): boolean =>
	(user as {role?: TUserRole | null} | null | undefined)?.role === 'admin';

export const isAdmin: Access = ({req}) => isAdminUser(req.user);

export const isLoggedIn: Access = ({req}) => Boolean(req.user);

export const isAdminField: FieldAccess = ({req}) => isAdminUser(req.user);

/** Content is edited by any signed-in user; the public site reads it through the Local API (overrideAccess). */
export const contentAccess = {read: isLoggedIn, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn};
