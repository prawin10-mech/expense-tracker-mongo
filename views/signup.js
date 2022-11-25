async function signup(e) {
  try {
    e.preventDefault();
    const signupDetails = {
      name: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    await axios.post("http://localhost:3000/users/signup", signupDetails);
    if (Response.status === 200) {
      window.location.href = "/login/login.html";
    } else {
      throw new Error("page is not found");
    }
  } catch (err) {
    document.body.innerHTML += `<div id="error" style="color: red";>${err}</div>`;
  }
}
