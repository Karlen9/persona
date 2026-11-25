import type {UploadField} from 'payload';

type TImageOptions = {required?: boolean; description?: string; hasMany?: boolean};

/** Upload of a single image (or several, with `hasMany`) from the media library. */
export const imageField = (name: string, label: string, options: TImageOptions = {}): UploadField =>
	({
		name,
		type: 'upload',
		relationTo: 'media',
		label,
		required: options.required ?? false,
		...(options.hasMany ? {hasMany: true} : {}),
		...(options.description ? {admin: {description: options.description}} : {})
	}) as UploadField;
