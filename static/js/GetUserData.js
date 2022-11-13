const _f = () => {
	const code = new URLSearchParams(window.location.search).get("code");
	const user = new URLSearchParams(window.location.search).get("user");

	if (!code) {
		return (document.getElementById(
			"status"
		).innerHTML = `<h1 class="error">Invalid code provided!</h1>`);
	}

	if (!user) {
		return (document.getElementById(
			"status"
		).innerHTML = `<h1 class="error">Invalid user provided!</h1>`);
	}

	fetch(`/getVerification/${user}/${code}`)
		.then((r) => r.json())
		.then((r) => {
			if (r.status != 200) {
				return (document.getElementById(
					"status"
				).innerHTML = `<h1 class="error">${r.message}</h1>`);
			}

			localStorage["targetVerification"] = JSON.stringify(r.data);

			// !!!  Change this url to your oauth url
			window.location.href =
				"https://osu.ppy.sh/oauth/authorize?response_type=code&redirect_uri=https://axer-auth.ppy.tn/validate&client_id=14940&scope=identify";
		});
};

_f();
