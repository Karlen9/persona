'use client';

import {createContext, useContext} from 'react';

import type {ReactNode} from 'react';

export type TTileActivity = {
	/** Hovered or keyboard-focused: previews speed up. */
	active: boolean;
	/** On screen and the tab is visible: previews may run timers. */
	visible: boolean;
	/** `prefers-reduced-motion: reduce`: previews must not autoplay. */
	reducedMotion: boolean;
};

const defaultActivity: TTileActivity = {active: false, visible: false, reducedMotion: false};

const TileActivityContext = createContext<TTileActivity>(defaultActivity);

type TTileActivityProviderProps = {
	value: TTileActivity;
	children: ReactNode;
};

export function TileActivityProvider({value, children}: TTileActivityProviderProps): ReactNode {
	return <TileActivityContext.Provider value={value}>{children}</TileActivityContext.Provider>;
}

export function useTileActivity(): TTileActivity {
	return useContext(TileActivityContext);
}
