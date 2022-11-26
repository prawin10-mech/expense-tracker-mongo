async function login(e) {
  e.preventDefault();
  const email = e.target.username.value;
  const password = e.target.password.value;
  const user = {
    email: email,
    password: password,
  };
  await axios
    .post(`http://localhost:3000/users/login/${email}`, user)
    .then((result) => {
      const body = document.body.innerHTML;
      document.body.innerHTML += `<div id="error" style="color: green";>${result.data.message}</div>`;
      localStorage.setItem("token", result.data.token);
      setTimeout(() => {
        if (result.data.success) {
          window.location.href = "../expenses/expenses.html";
        }
      }, 2000);

      setTimeout(() => {
        document.body.innerHTML = body;
      }, 3000);
    });
}
