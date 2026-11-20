type TClassValue = string | false | null | undefined;

export function cn(...values: TClassValue[]): string {
	return values.filter(Boolean).join(' ');
}
