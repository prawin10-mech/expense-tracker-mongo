async function login(e) {
  e.preventDefault();
  const email = e.target.username.value;
  const password = e.target.password.value;
  await axios
    .get(`http://localhost:3000/users/login/${email}`)
    .then((result) => {
      if (result.data[0] != null) {
        if (result.data[0].password == password) {
          const body = document.body.innerHTML;
          document.body.innerHTML += `<div id="error" style="color: green";>user logged successfully</div>`;
          setTimeout(() => {
            document.body.innerHTML = body;
          }, 3000);
        } else {
          const body = document.body.innerHTML;
          document.body.innerHTML += `<div id="error" style="color: red";>password is not matched please enter the correct password</div>`;
          setTimeout(() => {
            document.body.innerHTML = body;
          }, 3000);
        }
      } else {
        const body = document.body.innerHTML;
        document.body.innerHTML += `<div id="error" style="color: red";>user not found please try to signup</div>`;
        setTimeout(() => {
          document.body.innerHTML = body;
        }, 3000);
      }
    });
}
