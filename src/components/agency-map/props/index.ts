import {Catwalk, DanceCouple, DanceMirror} from './dance';
import {Barre, Reformer, YogaMat} from './fitness';
import {Chessboard, Globe, LunchTable, MirrorDesk, SchoolDesks} from './classes';
import {Armchairs, DeskLamp, FamilySofa} from './lounge';
import {
	ArmchairsModel,
	BarreModel,
	ChessboardModel,
	CurtainStageModel,
	DeskLampModel,
	EaselModel,
	FamilySofaModel,
	GlobeModel,
	LunchTableModel,
	MicrophoneModel,
	MicroscopeDressing,
	MirrorDeskModel,
	PianoModel,
	PotteryWheelModel,
	RobotModel,
	SchoolDesksModel,
	SpeakerDressing,
	YogaMatModel,
	withDressing,
	withModels
} from './modelProps';
import {Reception} from './reception';
import {CurtainStage, Microphone, Piano} from './stage';
import {Easel, PotteryWheel, Robot, TeslaCoil} from './workshop';

import type {ComponentType} from 'react';
import type {TAgencyPropKind} from '@/content/agencyMap';
import type {TPropProps} from './shared';

export type {TPropProps} from './shared';

/**
 * Registry of props. Most are glTF models (see `modelProps.tsx`) that show their procedural stand-in until the file
 * loads; megavolt, tancy, bachata, shkola-modeley and the reception stay procedural (megavolt and tancy get model
 * dressing). Every entry accepts the same `TPropProps`; the map and hotspot logic never look inside.
 */
export const agencyProps: Record<TAgencyPropKind, ComponentType<TPropProps>> = {
	microphone: withModels(MicrophoneModel, Microphone),
	piano: withModels(PianoModel, Piano),
	curtainStage: withModels(CurtainStageModel, CurtainStage),
	danceMirror: withDressing(DanceMirror, SpeakerDressing),
	danceCouple: DanceCouple,
	catwalk: Catwalk,
	reformer: Reformer,
	yogaMat: withModels(YogaMatModel, YogaMat),
	barre: withModels(BarreModel, Barre),
	easel: withModels(EaselModel, Easel),
	potteryWheel: withModels(PotteryWheelModel, PotteryWheel),
	robot: withModels(RobotModel, Robot),
	teslaCoil: withDressing(TeslaCoil, MicroscopeDressing),
	chessboard: withModels(ChessboardModel, Chessboard),
	schoolDesks: withModels(SchoolDesksModel, SchoolDesks),
	globe: withModels(GlobeModel, Globe),
	mirrorDesk: withModels(MirrorDeskModel, MirrorDesk),
	lunchTable: withModels(LunchTableModel, LunchTable),
	familySofa: withModels(FamilySofaModel, FamilySofa),
	armchairs: withModels(ArmchairsModel, Armchairs),
	deskLamp: withModels(DeskLampModel, DeskLamp),
	reception: Reception
};
