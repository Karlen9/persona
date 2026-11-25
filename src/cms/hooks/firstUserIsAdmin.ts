import type {CollectionBeforeChangeHook} from 'payload';

// The user created through Payload's "create first user" screen always becomes an admin.
export const firstUserIsAdmin: CollectionBeforeChangeHook = async ({data, operation, req}) => {
	if (operation !== 'create') {
		return data;
	}
	const {totalDocs} = await req.payload.count({collection: 'users', overrideAccess: true, req});
	if (totalDocs === 0) {
		return {...data, role: 'admin'};
	}
	return data;
};
