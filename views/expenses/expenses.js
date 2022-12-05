const token = localStorage.getItem("token");

const pagination = document.getElementById("pagination");

pagination.addEventListener("click", (e) => {
  let id = e.target.id;
  axios
    .get(`http://localhost:3000/pages${id}`, {
      headers: { Authorization: token },
    })
    .then((result) => {
      let musicLength = result.data.length;
      let musicData = result.data;
      let childNode = "";
      for (i = 0; i < musicLength; i++) {
        let data = musicData[i];

        childNode += `<li id=${data.id}>${data.money} Rupees for ${data.description}-${data.category}
                    <button id="deleteBtn" onclick="deleteData('${data.id}')">X</button>
                    </li> </ul>`;
      }
      const addExpenses = document.getElementById("addExpenses");
      addExpenses.innerHTML = childNode;
    });
});

let row = localStorage.getItem("rows");
function homePage() {
  console.log(row);
  axios
    .get(`http://localhost:3000/pages?page=0&rows=${row}`, {
      headers: { Authorization: token },
    })
    .then((result) => {
      let musicLength = result.data.length;
      let musicData = result.data;
      let childNode = "";
      for (i = 0; i < musicLength; i++) {
        let data = musicData[i];

        childNode += `<li id=${data.id}>${data.money} Rupees for ${data.description}-${data.category}
                    <button id="deleteBtn" onclick="deleteData('${data.id}')">X</button>
                    </li> </ul>`;
      }
      const addExpenses = document.getElementById("addExpenses");
      addExpenses.innerHTML = childNode;
    });
}

homePage();

let c = 0;
let cc = 1;
function pagenation() {
  axios
    .get("http://localhost:3000/getexpenses", {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log("hello", response, "hello");
      let productLen = response.data.length;
      console.log(productLen);

      if (productLen % 2 == 0) {
        console.log("helloo even");
        let first = productLen / 5;
        console.log(first);
        for (let i = 0; i < first; i++) {
          pagination.innerHTML += `<button style="border:none; padding: 7px; margin:3px; background:red; 
          color:#fff; " class="allbtns" id="?page=${c++}">
              ${cc++}
            </button>`;
        }
      } else {
        let first = Math.trunc(productLen / 5) + 1;
        console.log("hello odd");
        for (let i = 0; i < first - 1; i++) {
          pagination.innerHTML += `<button  class="allbtns" id="?page=${c++}">
              ${cc++}
            </button>`;
        }
      }
    })
    .catch((err) => console.log(err));
}
pagenation();

async function addExpense(e) {
  e.preventDefault();

  const money = e.target.money.value;
  const description = e.target.description.value;
  const category = e.target.category.value;

  const expense = {
    money: money,
    description: description,
    category: category,
  };
  try {
    const response = await axios.post(
      "http://localhost:3000/expenses",
      expense,
      {
        headers: { Authorization: token },
      }
    );
    addToDisplay(response.data);
  } catch (err) {
    console.log(err);
  }
}

const showDetailsOnDisplay = (data) => {
  var parentNode = document.getElementById("addExpenses");
  var datas = document.createElement("div");
  datas.innerText = "Expenses";
  data.expenses.forEach((data) => {
    var childNode = `<li id=${data.id}>${data.money} Rupees for ${data.description}-${data.category}
                    <button id="deleteBtn" onclick="deleteData('${data.id}')">X</button>
                    </li> </ul>`;
    datas.innerHTML += childNode;
  });
  parentNode.innerHTML = datas.innerHTML;
  addDownloadedFiles(data.expenses[0].userId);
};

const addToDisplay = async (data) => {
  console.log(data);
  var parentNode = document.getElementById("addExpenses");
  var childNode = `<li id=${data.id}>${data.money} Rupees for ${data.description}-${data.category}
                    <button id="deleteBtn" onclick="deleteDataFromDisplay('${data.id}')">X</button>
                    </li>`;
  parentNode.innerHTML += childNode;
  document.getElementById("money").value = "";
  document.getElementById("description").value = "";
  addDownloadedFiles(data.id);
};

const deleteData = async (userId) => {
  try {
    console.log(userId);
    deleteDataFromDisplay(userId);
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:3000/expenses/delete/${userId}`, {
      headers: { Authorization: token },
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteDataFromDisplay = async (userId) => {
  let parentNode = document.getElementById("addExpenses");
  let childNode = document.getElementById(userId);
  parentNode.removeChild(childNode);
};

document.getElementById("premiumBtn").onclick = async function (e) {
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    {
      headers: { Authorization: token },
    }
  );
  var options = {
    key: response.data.key_id, // Enter the Key ID generated from the Dashboard
    name: "Test Company",
    order_id: response.data.order.id, // For one time payment
    prefill: {
      name: "Test User",
      email: "test.user@example.com",
      contact: "7003442036",
    },
    theme: {
      color: "#3399cc",
    },
    // This handler function will handle the success payment
    handler: function (response) {
      axios
        .post(
          "http://localhost:3000/purchase/updatetransactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          {
            headers: { Authorization: token },
          }
        )
        .then(() => {
          alert("You are a Premium User Now");
        })
        .catch(() => {
          alert("Something went wrong. Try Again!!!");
        });
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    alert(response.error.code);
    alert(response.error.description);
  });
};

const getUsers = async () => {
  const user = await axios.get("http://localhost:3000/payment/membership", {
    headers: { Authorization: token },
  });
  const isPremiumUser = user.data;

  if (isPremiumUser) {
    const btn = document.getElementById("premiumBtn");
    btn.classList.add("active");
    document.body.style.background = "#778899";

    const premiumUsers = await axios.get(
      "http://localhost:3000/users/users/premiumusers"
    );

    let premiumUsersData = [];
    const n = premiumUsers.data;
    for (let i = 0; i < n.length; i++) {
      const userId = n[i].id;
      const premiumUserExpenses = await axios.get(
        `http://localhost:3000/users/premiumusers/expenses/${userId}`
      );
      const userObject = {
        userId: userId,
        expenselength: `${premiumUserExpenses.data.length}`,
      };
      premiumUsersData.push(userObject);
    }
    const sortedArray = premiumUsersData.sort(function (a, b) {
      return b.expenselength - a.expenselength;
    });
    sortedArray;
    const parentNode = document.getElementById("leaderboard");
    const childNode = `<a id="expenses" href="expensesData.html">Expenses</a><div id="leader">leaderboard</div>`;
    parentNode.innerHTML = childNode;
    for (let i = 0; i < premiumUsersData.length; i++) {
      // console.log(premiumUsersData[i].userId);
      const user = await axios.get(
        `http://localhost:3000/users/${premiumUsersData[i].userId}`
      );
      const name = user.data[0].name;
      const childNode = `<li><button onclick="getExpenseDetails(${premiumUsersData[i].userId})">${name}</button></li>`;
      parentNode.innerHTML += childNode;
    }
  }
};

//axios.get("http://localhost:3000/users/users/premiumusers").then((user) => {
// console.log(user);
//});
getUsers();

async function getExpenseDetails(id) {
  const userDetails = await axios.get(
    `http://localhost:3000/users/premiumusers/expenses/${id}`
  );
  const userExpensedetails = userDetails.data;
  var parentNode = document.getElementById("addExpenses");
  parentNode.innerHTML = "";
  for (let i = 0; i < userExpensedetails.length; i++) {
    const data = userExpensedetails[i];

    var childNode = `<li id=${data.id}>${data.money} Rupees for ${data.description}-${data.category}
                    <button id="deleteBtn" onclick="deleteData('${data.id}')">X</button>
                    </li>`;
    parentNode.innerHTML += childNode;
  }
}

async function downloadExpense() {
  try {
    const response = await axios.get(
      "http://localhost:3000/users/expenses/download",
      {
        headers: { Authorization: token },
      }
    );
    // console.log(response);
    if (response.status == 200) {
      const a = document.createElement("a");
      a.href = response.data.fileURL;
      // console.log(a);
      a.download = "myexpense.csv";
      //a.click();
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    console.log(err);
  }
}

const addDownlodDFiles = document.getElementById("addDownloadedFiles");
async function addDownloadedFiles(userId) {
  console.log(userId);
  const response = await axios.get(
    "http://localhost:3000/users/expenses/download",
    {
      headers: { Authorization: token },
    }
  );

  console.log(response);
  addDownlodDFiles.innerHTML += `<a href="${response.data.fileURL}">Expenses${response.data.date}</a> <br>`;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../signup/login.html";
}

function rows(value) {
  const rows = document.getElementById("rows").value;
  localStorage.setItem("rows", value);
}
