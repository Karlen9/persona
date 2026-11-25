import {isAdmin, isAdminField, isAdminUser} from '@/cms/access/roles';
import {firstUserIsAdmin} from '@/cms/hooks/firstUserIsAdmin';

import type {Access, CollectionConfig} from 'payload';

const adminOrSelf: Access = ({req}) => {
	if (!req.user) {
		return false;
	}
	if (isAdminUser(req.user)) {
		return true;
	}
	return {id: {equals: req.user.id}};
};

export const Users: CollectionConfig = {
	slug: 'users',
	labels: {singular: 'Пользователь', plural: 'Пользователи'},
	admin: {
		group: 'Система',
		useAsTitle: 'email',
		defaultColumns: ['name', 'email', 'role'],
		// Only admins see the users list; editors reach their own profile through the account page.
		hidden: ({user}) => !isAdminUser(user)
	},
	auth: {
		maxLoginAttempts: 5,
		lockTime: 15 * 60 * 1000,
		tokenExpiration: 8 * 60 * 60,
		cookies: {secure: process.env.NODE_ENV === 'production', sameSite: 'Lax'}
	},
	access: {
		admin: ({req}) => Boolean(req.user),
		create: isAdmin,
		read: adminOrSelf,
		update: adminOrSelf,
		delete: isAdmin
	},
	hooks: {beforeChange: [firstUserIsAdmin]},
	fields: [
		{name: 'name', type: 'text', label: 'Имя'},
		{
			name: 'role',
			type: 'select',
			label: 'Роль',
			required: true,
			defaultValue: 'editor',
			options: [
				{label: 'Администратор', value: 'admin'},
				{label: 'Редактор', value: 'editor'}
			],
			access: {
				// Anonymous create only happens for the very first user (create is admin-only otherwise); the hook forces admin.
				create: ({req}) => !req.user || isAdminUser(req.user),
				update: isAdminField
			},
			admin: {description: 'Редактор может менять контент, но не пользователей.'}
		}
	]
};
