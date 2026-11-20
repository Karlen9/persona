'use client';

import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';

import {Icon} from '@/components/ui/Icon';

import type {ReactNode} from 'react';
import type {TImage} from '@/components/ui/types';

type TTeacherCardProps = {
	name: string;
	/** Omitted when the bio does not state a role. */
	role?: string | null;
	/** Photo of the card. */
	photo?: TImage;
	/** Portrait shown inside the dialog next to the bio. */
	dialogPhoto?: TImage;
	/** Bio shown in a dialog. It is rendered by the server (passed as a node), so it is part of the HTML for SEO. */
	bio?: ReactNode;
};

/** Photo-only teacher card (name and role are on the photo; the name stays as sr-only text); with a bio it opens a native modal <dialog> (focus trap, Esc to close, focus returns to the card). */
export function TeacherCard({name, role, photo, dialogPhoto, bio}: TTeacherCardProps): ReactNode {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = ref.current;
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	}, [open]);

	const content = (
		<>
			<div className={'relative aspect-[9/16] overflow-hidden bg-gradient-to-br from-brand-100 to-accent-100'}>
				{photo ? (
					<Image
						src={photo.src}
						alt={photo.alt}
						fill
						sizes={'(min-width: 1200px) 282px, (min-width: 768px) 30vw, 50vw'}
						className={'object-cover object-center'}
					/>
				) : null}
			</div>
			<span className={'sr-only'}>{name}</span>
		</>
	);
	const cardClass = 'block w-full overflow-hidden rounded-card border border-line bg-white text-left shadow-card';

	if (!bio) return <div className={`${cardClass} h-full`}>{content}</div>;

	return (
		<>
			<button
				type={'button'}
				onClick={() => setOpen(true)}
				aria-haspopup={'dialog'}
				className={`${cardClass} h-full transition-shadow hover:shadow-pop`}
			>
				{content}
				<span className={'sr-only'}>{'. Открыть биографию'}</span>
			</button>
			<dialog
				ref={ref}
				aria-label={name}
				onClose={() => setOpen(false)}
				onClick={(event) => {
					if (event.target === ref.current) setOpen(false);
				}}
				className={'m-auto w-[min(92vw,720px)] rounded-card bg-white p-0 shadow-pop'}
			>
				<div className={'relative max-h-[85dvh] overflow-y-auto p-6 sm:p-8'}>
					<button
						type={'button'}
						onClick={() => setOpen(false)}
						aria-label={'Закрыть'}
						className={
							'absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-surface text-ink'
						}
					>
						<Icon name={'close'} />
					</button>
					<div className={'flex flex-col gap-5 sm:flex-row sm:items-start'}>
						{dialogPhoto ? (
							<div className={'relative aspect-square w-40 shrink-0 overflow-hidden rounded-card'}>
								<Image
									src={dialogPhoto.src}
									alt={dialogPhoto.alt}
									fill
									sizes={'160px'}
									className={'object-cover'}
								/>
							</div>
						) : null}
						<div className={'min-w-0 flex-1'}>
							<h3 className={'pr-12 text-2xl font-extrabold text-ink'}>{name}</h3>
							{role ? <p className={'mt-1 font-semibold text-brand-800'}>{role}</p> : null}
						</div>
					</div>
					<div className={'mt-5 flex flex-col gap-3 text-[15px]'}>{bio}</div>
				</div>
			</dialog>
		</>
	);
}
