const _f = () => {
  const code = new URLSearchParams(window.location.search).get("code");
  const userCredentials = JSON.parse(localStorage["targetVerification"]);

  if (!code) {
    return (document.getElementById(
      "status"
    ).innerHTML = `<h1 class="error">Invalid code provided!</h1>`);
  }

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
      if (r.status != 200) {
        return (document.getElementById(
          "status"
        ).innerHTML = `<h1 class="error">${r.message}</h1>`);
      }

      document.getElementById(
        "status"
      ).innerHTML = `<h1 class="success">You are verified!</h1>`;
    });
};

_f();
