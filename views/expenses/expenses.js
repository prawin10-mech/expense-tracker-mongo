const token = localStorage.getItem("token");
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
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:3000/expenses",
      expense,
      {
        headers: { Authorization: token },
      }
    );
    showDetailsOnDisplay(response.data);
  } catch (err) {
    console.log(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const getData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:3000/expenses`, {
        headers: { Authorization: token },
      });
      let data = response.data;
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        showDetailsOnDisplay(response.data[i]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  getData();
});

const showDetailsOnDisplay = async (data) => {
  try {
    await axios.get(`http://localhost:3000/expenses/${data.id}`);
    var parentNode = document.getElementById("addExpenses");
    var childNode = `<li id=${data.id}>${data.money} Rupees for ${data.description}-${data.category}
                    <button id="editBtn" onclick="editData('${data.id}')">Edit</button>
                    <button id="deleteBtn" onclick="deleteData('${data.id}')">X</button>
                    </li>`;
    parentNode.innerHTML += childNode;
    document.getElementById("money").value = "";
    document.getElementById("description").value = "";
    addDownloadedFiles(data.id);
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async (userId) => {
  try {
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
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  console.log(response);
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
          { headers: { Authorization: token } }
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
        `http://localhost:3000/users/premiumusers/expenses/${n[i].id}`
      );
      const userObject = {
        userId: userId,
        expenselength: `${premiumUserExpenses.data.length}`,
      };
      premiumUsersData.push(userObject);
    }
    premiumUsersData.sort(function (a, b) {
      return b.expenselength.localeCompare(a.expenselength);
    });

    const parentNode = document.getElementById("leaderboard");

    const childNode = `<a id="expenses" href="expensesData.html">Expenses</a><div id="leader">leaderboard</div>`;
    parentNode.innerHTML = childNode;
    for (let i = 0; i < premiumUsersData.length; i++) {
      console.log(premiumUsersData[i].userId);
      const user = await axios.get(
        `http://localhost:3000/users/${premiumUsersData[i].userId}`
      );
      const name = user.data[0].name;
      const childNode = `<li><button onclick="getExpenseDetails(${premiumUsersData[i].userId})">${name}</button></li>`;
      parentNode.innerHTML += childNode;
    }
  }
};

axios.get("http://localhost:3000/users/users/premiumusers").then((user) => {
  console.log(user);
});
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
                    <button id="editBtn" onclick="editData('${data.id}')">Edit</button>
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
    console.log(response);
    if (response.status == 200) {
      const a = document.createElement("a");
      a.href = response.data.fileURL;
      console.log(a);
      a.download = "myexpense.csv";
      a.click();
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    console.log(err);
  }
}

const addDownlodDFiles = document.getElementById("addDownloadedFiles");
async function addDownloadedFiles(userId) {
  const response = await axios.get(
    "http://localhost:3000/users/expenses/download",
    {
      headers: { Authorization: token },
    }
  );
  console.log(response.data.date);
  addDownlodDFiles.innerHTML += `<a href="${response.data.fileURL}">Expenses${response.data.date}</a>`;
}
