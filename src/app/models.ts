export interface IResult {
	startDate: string,
	endDate: string,
	classes: IClass[]
}

export interface IClass {
	id: string,
	entityStatus: string,
	startDate: string,
	startTime: string,
	duration: number,
	level: string,
	classStatus: string,
	externalBookingsNumber: number,
	inNewGroup: boolean,
	maxCapacity: number,
	comment: string,
	isNotRecurrent: boolean,
	color: string,
	prototypeId: string,
	conflictType: number
	room: IRoom,
	course: ICourse,
	coach: ICoach
}

export interface IRoom {
	id: string,
	name: string,
	color: string,
}

export interface ICourse {
	id: string,
	name: string,
	color: string,
}
export interface ICoach {
	id: string,
	name: string,
	color: string,
}
