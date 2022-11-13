/*
 * parses time from seconds to minutes, or hours, or days
 */

export function parseTime(seconds: number): string {
	let minutes = Math.floor(seconds / 60);
	seconds %= 60;
	let hours = Math.floor(minutes / 60);
	minutes %= 60;
	let days = Math.floor(hours / 24);
	hours %= 24;

	let time = "";

	switch (true) {
		case days > 0:
			time = `${days}d`;
			break;
		case hours > 0:
			time = `${hours}h`;
			break;
		case minutes > 0:
			time = `${minutes}m`;
			break;
		case seconds > 0:
			time = `${seconds}s`;
			break;
		default:
			time = "0s";
			break;
	}

	return time;
}
