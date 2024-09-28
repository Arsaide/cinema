interface ITopMovies {
	title: string;
	views: number;
}

interface ISalesByWeek {
	date: string;
	total: number;
}

export interface IStatisticsResponse {
	topMovies: ITopMovies[];
	salesByWeek: ISalesByWeek[];
}
