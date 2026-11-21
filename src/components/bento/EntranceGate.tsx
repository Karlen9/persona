'use client';

import {useEffect, useState} from 'react';

import type {ReactNode} from 'react';

// Module-level on purpose: it survives client-side navigations, so the stagger plays on the first load only.
let played = false;

export function EntranceGate({children}: {children: ReactNode}): ReactNode {
	const [entrance] = useState(() => !played);

	useEffect(() => {
		played = true;
	}, []);

	return <div data-entrance={entrance ? 'on' : 'off'}>{children}</div>;
}
