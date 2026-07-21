import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ----------------------------
// Global Variables
// ----------------------------

let transactions = [];
let editId = null;

// ----------------------------
// DOM Elements
// ----------------------------

const popup = document.getElementById("popup");

const fab = document.getElementById("fab");

const saveBtn = document.getElementById("saveTransaction");

const amountInput = document.getElementById("amount");

const typeInput = document.getElementById("type");

const categoryInput = document.getElementById("category");

const dateInput = document.getElementById("date");

const noteInput = document.getElementById("note");

const balance = document.getElementById("balance");

const income = document.getElementById("income");

const expense = document.getElementById("expense");

const transactionList = document.getElementById("transactionList");

// ----------------------------
// Open Popup
// ----------------------------

fab.addEventListener("click", () => {

    popup.style.display = "flex";

    editId = null;

});

// ----------------------------
// Close Popup
// ----------------------------

popup.addEventListener("click", (e) => {

    if (e.target === popup) {

        popup.style.display = "none";

        clearForm();

    }

});

// ----------------------------
// Clear Form
// ----------------------------

function clearForm() {

    amountInput.value = "";

    typeInput.value = "Expense";

    categoryInput.value = "Food";

    dateInput.value = "";

    noteInput.value = "";

}

// ----------------------------
// Firestore Reference
// ----------------------------

const transactionRef = collection(db, "transactions");

const transactionQuery = query(
    transactionRef,
    orderBy("createdAt", "desc")
);

// ----------------------------
// Live Data Sync
// ----------------------------

onSnapshot(transactionQuery, (snapshot) => {

    transactions = [];

    snapshot.forEach((document) => {

        transactions.push({

            id: document.id,

            ...document.data()

        });

    });

    renderTransactions();

    calculateTotals();

});

// ----------------------------
// Calculate Totals
// ----------------------------

function calculateTotals() {

    let totalIncome = 0;

    let totalExpense = 0;

    transactions.forEach((item) => {

        if (item.type === "Income") {

            totalIncome += Number(item.amount);

        } else {

            totalExpense += Number(item.amount);

        }

    });

    income.innerHTML = "₹" + totalIncome.toLocaleString();

    expense.innerHTML = "₹" + totalExpense.toLocaleString();

    balance.innerHTML = "₹" + (totalIncome - totalExpense).toLocaleString();

}

// ----------------------------
// Category Emoji
// ----------------------------

function getEmoji(category) {

    switch (category) {

        case "Food":
            return "🍔";

        case "Groceries":
            return "🛒";

        case "Bus":
            return "🚌";

        case "Train":
            return "🚆";

        case "Flight":
            return "✈️";

        case "Fuel":
            return "⛽";

        case "Shopping":
            return "🛍️";

        case "Medical":
            return "💊";

        case "Entertainment":
            return "🎬";

        case "Recharge":
            return "📱";

        case "Electricity":
            return "💡";

        case "Rent":
            return "🏠";

        case "Salary":
            return "💼";

        case "Business":
            return "🏢";

        case "Investment":
            return "📈";

        case "Gift":
            return "🎁";

        case "Education":
            return "🎓";

        default:
            return "💰";

    }

}
// ----------------------------
// Render Transactions
// ----------------------------

function renderTransactions() {

    transactionList.innerHTML = "";

    if (transactions.length === 0) {

        transactionList.innerHTML = `
            <div class="transaction">
                <div class="left">
                    <div class="icon other">📂</div>
                    <div>
                        <h4>No Transactions</h4>
                        <small>Start by adding your first expense.</small>
                    </div>
                </div>
            </div>
        `;

        return;
    }

    transactions.forEach((item) => {

        const div = document.createElement("div");

        div.className = "transaction";

        div.innerHTML = `

        <div class="left">

            <div class="icon other">

                ${getEmoji(item.category)}

            </div>

            <div>

                <h4>${item.category}</h4>

                <small>${item.note || "-"}</small><br>

                <small>${item.date}</small>

            </div>

        </div>

        <div style="text-align:right">

            <div class="${item.type === "Income" ? "income" : "expense"} amount">

                ${item.type === "Income" ? "+" : "-"} ₹${Number(item.amount).toLocaleString()}

            </div>

            <div style="margin-top:10px">

                <button onclick="editTransaction('${item.id}')">

                    ✏️

                </button>

                <button onclick="deleteTransaction('${item.id}')">

                    🗑️

                </button>

            </div>

        </div>

        `;

        transactionList.appendChild(div);

    });

}

// ----------------------------
// Save Transaction
// ----------------------------

saveBtn.addEventListener("click", async () => {

    const amount = Number(amountInput.value);

    const type = typeInput.value;

    const category = categoryInput.value;

    const date = dateInput.value;

    const note = noteInput.value.trim();

    if (amount <= 0) {

        alert("Enter valid amount");

        return;

    }

    if (date === "") {

        alert("Select date");

        return;

    }

    if (editId === null) {

        await addDoc(transactionRef, {

            amount,

            type,

            category,

            date,

            note,

            createdAt: serverTimestamp()

        });

    } else {

        await updateDoc(doc(db, "transactions", editId), {

            amount,

            type,

            category,

            date,

            note

        });

    }

    popup.style.display = "none";

    clearForm();

});

// ----------------------------
// Delete Transaction
// ----------------------------

window.deleteTransaction = async function(id) {

    const ok = confirm("Delete this transaction?");

    if (!ok) return;

    await deleteDoc(doc(db, "transactions", id));

}

// ----------------------------
// Edit Transaction
// ----------------------------

window.editTransaction = function(id) {

    const item = transactions.find(x => x.id === id);

    if (!item) return;

    editId = id;

    amountInput.value = item.amount;

    typeInput.value = item.type;

    categoryInput.value = item.category;

    dateInput.value = item.date;

    noteInput.value = item.note;

    popup.style.display = "flex";

}
// ======================================================
// PART 3
// Continue below Part 2
// ======================================================

// ----------------------------
// Today's Expense
// ----------------------------

function getTodayExpense() {

    const today = new Date().toISOString().split("T")[0];

    let total = 0;

    transactions.forEach((item) => {

        if (
            item.type === "Expense" &&
            item.date === today
        ) {

            total += Number(item.amount);

        }

    });

    return total;

}

// ----------------------------
// Current Month Expense
// ----------------------------

function getMonthExpense() {

    const now = new Date();

    const month = now.getMonth() + 1;

    const year = now.getFullYear();

    let total = 0;

    transactions.forEach((item) => {

        const d = new Date(item.date);

        if (
            item.type === "Expense" &&
            d.getMonth() + 1 === month &&
            d.getFullYear() === year
        ) {

            total += Number(item.amount);

        }

    });

    return total;

}

// ----------------------------
// Search Transactions
// ----------------------------

window.searchTransactions = function(keyword) {

    keyword = keyword.toLowerCase();

    const cards = document.querySelectorAll(".transaction");

    cards.forEach((card) => {

        if (card.innerText.toLowerCase().includes(keyword)) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}

// ----------------------------
// Filter Type
// ----------------------------

window.filterType = function(type) {

    const cards = document.querySelectorAll(".transaction");

    cards.forEach((card) => {

        if (type === "All") {

            card.style.display = "";

            return;

        }

        if (card.innerText.includes(type)) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}

// ----------------------------
// Export CSV
// ----------------------------

window.exportCSV = function() {

    if (transactions.length === 0) {

        alert("No data");

        return;

    }

    let csv = "Date,Category,Type,Amount,Note\n";

    transactions.forEach((t) => {

        csv += `${t.date},${t.category},${t.type},${t.amount},"${t.note}"\n`;

    });

    const blob = new Blob([csv], {

        type: "text/csv"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "ExpenseTracker.csv";

    a.click();

    URL.revokeObjectURL(url);

}

// ----------------------------
// Refresh Dashboard
// ----------------------------

function refreshDashboard(){

    calculateTotals();

    document.getElementById("todayExpense").innerHTML =
    "₹" + getTodayExpense().toLocaleString();

    document.getElementById("weekExpense").innerHTML =
    "₹" + getWeekExpense().toLocaleString();

    document.getElementById("monthExpense").innerHTML =
    "₹" + getMonthExpense().toLocaleString();

    document.getElementById("transactionCount").innerHTML =
    transactions.length;

}

// ----------------------------
// Override Firestore Listener
// ----------------------------

onSnapshot(transactionQuery, (snapshot) => {

    transactions = [];

    snapshot.forEach((docSnap) => {

        transactions.push({

            id: docSnap.id,

            ...docSnap.data()

        });

    });

    renderTransactions();

    refreshDashboard();

});

// ----------------------------
// Keyboard Shortcut
// ----------------------------

document.addEventListener("keydown", function(e){

    if(e.key==="Escape"){

        popup.style.display="none";

        clearForm();

    }

});

// ----------------------------
// Welcome Message
// ----------------------------

console.log("Expense Tracker Loaded Successfully");

// ======================================================
// END OF SCRIPT.JS
// ======================================================
