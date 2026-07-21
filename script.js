import {
    db
} from "./firebase-config.js";

let transactions = [];

// Elements
const popup = document.getElementById("popup");
const fab = document.getElementById("fab");
const saveBtn = document.getElementById("saveTransaction");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const transactionList = document.getElementById("transactionList");

// Popup
fab.onclick = () => {
    popup.style.display = "flex";
};

popup.onclick = (e) => {
    if (e.target === popup) {
        popup.style.display = "none";
    }
};

// Save Transaction
saveBtn.onclick = () => {

    const amount = Number(document.getElementById("amount").value);

    const type = document.getElementById("type").value;

    const category = document.getElementById("category").value;

    const date = document.getElementById("date").value;

    const note = document.getElementById("note").value;

    if (amount <= 0 || date === "") {

        alert("Enter valid details");

        return;

    }

    const transaction = {

        id: Date.now(),

        amount,

        type,

        category,

        date,

        note

    };

    transactions.unshift(transaction);

    renderTransactions();

    calculate();

    popup.style.display = "none";

    clearForm();

};

// Clear Form
function clearForm() {

    document.getElementById("amount").value = "";

    document.getElementById("note").value = "";

    document.getElementById("date").value = "";

}

// Calculate Balance
function calculate() {

    let totalIncome = 0;

    let totalExpense = 0;

    transactions.forEach(t => {

        if (t.type === "Income") {

            totalIncome += t.amount;

        } else {

            totalExpense += t.amount;

        }

    });

    income.innerHTML = "₹" + totalIncome;

    expense.innerHTML = "₹" + totalExpense;

    balance.innerHTML = "₹" + (totalIncome - totalExpense);

}

// Render Transactions
function renderTransactions() {

    transactionList.innerHTML = "";

    transactions.forEach(t => {

        const div = document.createElement("div");

        div.className = "transaction";

        div.innerHTML = `

        <div class="left">

            <div class="icon other">

                ${emoji(t.category)}

            </div>

            <div>

                <h4>${t.category}</h4>

                <small>${t.note}</small><br>

                <small>${t.date}</small>

            </div>

        </div>

        <div>

            <div class="${t.type=="Income"?"income":"expense"} amount">

                ${t.type=="Income"?"+":"-"} ₹${t.amount}

            </div>

        </div>

        `;

        transactionList.appendChild(div);

    });

}

// Category Emoji
function emoji(cat){

switch(cat){

case "Food": return "🍔";

case "Groceries": return "🛒";

case "Bus": return "🚌";

case "Train": return "🚆";

case "Flight": return "✈️";

case "Fuel": return "⛽";

case "Shopping": return "🛍️";

case "Medical": return "💊";

case "Recharge": return "📱";

case "Electricity": return "💡";

case "Rent": return "🏠";

case "Salary": return "💼";

case "Business": return "🏢";

case "Investment": return "📈";

case "Education": return "🎓";

default: return "💰";

}

}
