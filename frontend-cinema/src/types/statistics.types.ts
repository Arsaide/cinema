interface ITopMovies {
	title: string;
	views: number;
}

interface ISalesByWeek {
	date: string;
	total: number;
}

export interface IMiddleStatisticsResponse {
	topMovies: ITopMovies[];
	salesByWeek: ISalesByWeek[];
}
