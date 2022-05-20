const _f = () => {
  const code = new URLSearchParams(window.location.search).get("code");
  const user = new URLSearchParams(window.location.search).get("user");

  if (!code) return alert("Invalid code provided!");
  if (!user) return alert("Invalid user provided!");

  fetch(`/getVerification/${user}/${code}`)
    .then((r) => r.json())
    .then((r) => {
      if (r.status != 200) return alert(r.message);

      localStorage["targetVerification"] = JSON.stringify(r.data);

      window.location.href =
        "https://osu.ppy.sh/oauth/authorize?response_type=code&redirect_uri=https://axer-auth.herokuapp.com/validate&client_id=14935&scope=identify";
    });
};

_f();
