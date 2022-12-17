export default (emoji: string) => {
	const emojis: any = {
		osu: "<:osu:950459762682781696>",
		mania: "<:mania:950459762577903616>",
		taiko: "<:taiko:950459762229788733>",
		catch: "<:catch:950459762590486568>",
		fruits: "<:catch:950459762590486568>",
	};

	const request = emojis[emoji];

	if (!request) return "";

	return request;
};
