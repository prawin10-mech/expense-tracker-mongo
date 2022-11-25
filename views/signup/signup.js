async function signup(e) {
  try {
    e.preventDefault();
    const signupDetails = {
      name: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      await axios.post("http://localhost:3000/users/signup", signupDetails);
      document.body.innerHTML += `<div id="error" style="color: green";>successfully logged please wait until it redirects</div>`;
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } catch (err) {
      document.body.innerHTML += `<div id="error" style="color: red";>${err} user Already found please try to login</div>`;
    }
  } catch (err) {
    document.body.innerHTML += `<div id="error" style="color: red";>${err}</div>`;
  }
}
