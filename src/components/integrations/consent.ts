import {useSyncExternalStore} from 'react';

export type TConsent = 'granted' | 'denied' | null;
/** 'unknown' is what the server (and the first hydration pass) sees. */
export type TConsentState = TConsent | 'unknown';

const STORAGE_KEY = 'persona-cookie-consent';
const EVENT_NAME = 'persona-consent-change';

export function readConsent(): TConsent {
	try {
		const value = window.localStorage.getItem(STORAGE_KEY);
		return value === 'granted' || value === 'denied' ? value : null;
	} catch {
		return null;
	}
}

export function writeConsent(value: Exclude<TConsent, null>): void {
	try {
		window.localStorage.setItem(STORAGE_KEY, value);
	} catch {
		/* storage unavailable: choice lasts for this page only */
	}
	window.dispatchEvent(new Event(EVENT_NAME));
}

function subscribe(callback: () => void): () => void {
	window.addEventListener(EVENT_NAME, callback);
	window.addEventListener('storage', callback);
	return () => {
		window.removeEventListener(EVENT_NAME, callback);
		window.removeEventListener('storage', callback);
	};
}

export function useConsent(): TConsentState {
	return useSyncExternalStore<TConsentState>(subscribe, readConsent, () => 'unknown');
}
