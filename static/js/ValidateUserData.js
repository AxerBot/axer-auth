const _f = () => {
  const code = new URLSearchParams(window.location.search).get("code");
  const userCredentials = JSON.parse(localStorage["targetVerification"]);

  if (!code) return alert("Invalid code provided!");

  fetch(
    `/validateUser/${userCredentials.user}/${userCredentials.guild}?code=${code}`,
    {
      method: "POST",
      headers: {
        authorization: userCredentials.token,
      },
    }
  )
    .then((r) => r.json())
    .then((r) => {
      if (r.status != 200) return alert(r.message);

      alert("SEXOOOOO");
    });
};

_f();
