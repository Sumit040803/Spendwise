import { useState, useEffect, useRef } from “react”;

const CATEGORIES = [
{ name: “Food & Dining”, icon: “🍔”, color: “#FF6B6B” },
{ name: “Transport”, icon: “🚗”, color: “#4ECDC4” },
{ name: “Shopping”, icon: “🛍️”, color: “#A78BFA” },
{ name: “Bills & Utilities”, icon: “💡”, color: “#FBBF24” },
{ name: “Entertainment”, icon: “🎬”, color: “#F472B6” },
{ name: “Health”, icon: “💊”, color: “#34D399” },
{ name: “Education”, icon: “📚”, color: “#60A5FA” },
{ name: “Other”, icon: “📦”, color: “#94A3B8” },
];

const MONTHS = [“Jan”,“Feb”,“Mar”,“Apr”,“May”,“Jun”,“Jul”,“Aug”,“Sep”,“Oct”,“Nov”,“Dec”];

function formatCurrency(amount) {
return “₹” + Number(amount).toLocaleString(“en-IN”, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getWeekDates() {
const today = new Date();
const day = today.getDay();
const diff = today.getDate() - day + (day === 0 ? -6 : 1);
const monday = new Date(today.setDate(diff));
const dates = [];
for (let i = 0; i < 7; i++) {
const d = new Date(monday);
d.setDate(monday.getDate() + i);
dates.push(d);
}
return dates;
}

function ExpenseTracker() {
const [expenses, setExpenses] = useState([]);
const [showAdd, setShowAdd] = useState(false);
const [amount, setAmount] = useState(””);
const [description, setDescription] = useState(””);
const [selectedCat, setSelectedCat] = useState(0);
const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split(“T”)[0]);
const [view, setView] = useState(“dashboard”);
const [editingId, setEditingId] = useState(null);
const [filterCat, setFilterCat] = useState(“All”);
const [budget, setBudget] = useState(30000);
const [showBudgetEdit, setShowBudgetEdit] = useState(false);
const [tempBudget, setTempBudget] = useState(“30000”);
const [animateIn, setAnimateIn] = useState(false);
const inputRef = useRef(null);

useEffect(() => {
setAnimateIn(true);
}, []);

useEffect(() => {
if (showAdd && inputRef.current) inputRef.current.focus();
}, [showAdd]);

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const monthExpenses = expenses.filter((e) => {
const d = new Date(e.date);
return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
});

const totalSpent = monthExpenses.reduce((s, e) => s + e.amount, 0);
const remaining = budget - totalSpent;
const percentSpent = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;

const categoryTotals = CATEGORIES.map((cat) => ({
…cat,
total: monthExpenses.filter((e) => e.category === cat.name).reduce((s, e) => s + e.amount, 0),
})).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

const weekDates = getWeekDates();
const weekData = weekDates.map((d) => {
const dateStr = d.toISOString().split(“T”)[0];
return {
day: [“Sun”,“Mon”,“Tue”,“Wed”,“Thu”,“Fri”,“Sat”][d.getDay()],
date: d.getDate(),
total: expenses.filter((e) => e.date === dateStr).reduce((s, e) => s + e.amount, 0),
isToday: dateStr === new Date().toISOString().split(“T”)[0],
};
});
const maxWeekDay = Math.max(…weekData.map((d) => d.total), 1);

const handleAdd = () => {
if (!amount || isNaN(amount) || Number(amount) <= 0) return;
if (editingId !== null) {
setExpenses((prev) =>
prev.map((e) =>
e.id === editingId
? { …e, amount: Number(amount), description, category: CATEGORIES[selectedCat].name, date: selectedDate }
: e
)
);
setEditingId(null);
} else {
const newExpense = {
id: Date.now(),
amount: Number(amount),
description: description || CATEGORIES[selectedCat].name,
category: CATEGORIES[selectedCat].name,
date: selectedDate,
createdAt: new Date().toISOString(),
};
setExpenses((prev) => [newExpense, …prev]);
}
setAmount(””);
setDescription(””);
setSelectedCat(0);
setSelectedDate(new Date().toISOString().split(“T”)[0]);
setShowAdd(false);
};

const handleEdit = (expense) => {
setAmount(String(expense.amount));
setDescription(expense.description);
setSelectedCat(CATEGORIES.findIndex((c) => c.name === expense.category));
setSelectedDate(expense.date);
setEditingId(expense.id);
setShowAdd(true);
};

const handleDelete = (id) => {
setExpenses((prev) => prev.filter((e) => e.id !== id));
};

const filteredExpenses = filterCat === “All”
? […expenses].sort((a, b) => new Date(b.date) - new Date(a.date))
: […expenses].filter((e) => e.category === filterCat).sort((a, b) => new Date(b.date) - new Date(a.date));

const todayExpenses = expenses.filter((e) => e.date === new Date().toISOString().split(“T”)[0]);
const todayTotal = todayExpenses.reduce((s, e) => s + e.amount, 0);

return (
<div style={{
minHeight: “100vh”,
background: “linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 40%, #16213e 100%)”,
fontFamily: “‘Outfit’, ‘SF Pro Display’, -apple-system, sans-serif”,
color: “#E8E8F0”,
maxWidth: “480px”,
margin: “0 auto”,
position: “relative”,
overflow: “hidden”,
}}>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

```
  {/* Ambient background orbs */}
  <div style={{ position: "fixed", top: "-120px", right: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(78,205,196,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
  <div style={{ position: "fixed", bottom: "-100px", left: "-60px", width: "250px", height: "250px", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

  {/* Header */}
  <div style={{
    padding: "20px 24px 16px",
    opacity: animateIn ? 1 : 0,
    transform: animateIn ? "translateY(0)" : "translateY(-20px)",
    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0, letterSpacing: "-0.5px", background: "linear-gradient(135deg, #E8E8F0 0%, #A78BFA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          SpendWise
        </h1>
        <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#6B7280", fontWeight: 400 }}>
          {MONTHS[currentMonth]} {currentYear} · Smart Expense Tracking
        </p>
      </div>
      <div style={{
        width: "42px", height: "42px", borderRadius: "14px",
        background: "linear-gradient(135deg, #4ECDC4, #A78BFA)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "18px", cursor: "pointer", boxShadow: "0 4px 15px rgba(78,205,196,0.3)",
      }} onClick={() => setShowBudgetEdit(true)}>
        ⚙️
      </div>
    </div>
  </div>

  {/* Navigation */}
  <div style={{
    display: "flex", gap: "6px", padding: "0 24px 16px", 
    opacity: animateIn ? 1 : 0, transition: "all 0.6s 0.1s cubic-bezier(0.16, 1, 0.3, 1)",
  }}>
    {[
      { key: "dashboard", label: "Overview", icon: "📊" },
      { key: "history", label: "History", icon: "📋" },
      { key: "insights", label: "Insights", icon: "💡" },
    ].map((tab) => (
      <button key={tab.key} onClick={() => setView(tab.key)} style={{
        flex: 1, padding: "10px 8px", borderRadius: "12px", border: "none",
        background: view === tab.key ? "rgba(78,205,196,0.15)" : "rgba(255,255,255,0.03)",
        color: view === tab.key ? "#4ECDC4" : "#6B7280",
        fontSize: "12px", fontWeight: 600, cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.3s ease",
        border: view === tab.key ? "1px solid rgba(78,205,196,0.2)" : "1px solid transparent",
      }}>
        <span style={{ fontSize: "16px", display: "block", marginBottom: "2px" }}>{tab.icon}</span>
        {tab.label}
      </button>
    ))}
  </div>

  {/* Main Content Area */}
  <div style={{ padding: "0 24px 120px", opacity: animateIn ? 1 : 0, transition: "all 0.6s 0.2s cubic-bezier(0.16, 1, 0.3, 1)" }}>

    {/* === DASHBOARD VIEW === */}
    {view === "dashboard" && (
      <>
        {/* Budget Card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(78,205,196,0.1) 0%, rgba(167,139,250,0.08) 100%)",
          borderRadius: "20px", padding: "24px",
          border: "1px solid rgba(78,205,196,0.12)",
          marginBottom: "16px",
          backdropFilter: "blur(10px)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#6B7280", margin: 0, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600 }}>Monthly Budget</p>
              <p style={{ fontSize: "36px", fontWeight: 800, margin: "4px 0 0", fontFamily: "'Space Mono', monospace", letterSpacing: "-1px" }}>
                {formatCurrency(budget)}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "11px", color: "#6B7280", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>Remaining</p>
              <p style={{
                fontSize: "22px", fontWeight: 700, margin: "2px 0 0",
                fontFamily: "'Space Mono', monospace",
                color: remaining >= 0 ? "#4ECDC4" : "#FF6B6B",
              }}>
                {formatCurrency(Math.abs(remaining))}
              </p>
              {remaining < 0 && <p style={{ fontSize: "10px", color: "#FF6B6B", margin: "2px 0 0" }}>Over budget!</p>}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ position: "relative", height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: "4px",
              width: `${percentSpent}%`,
              background: percentSpent > 90 ? "linear-gradient(90deg, #FBBF24, #FF6B6B)" : percentSpent > 70 ? "linear-gradient(90deg, #4ECDC4, #FBBF24)" : "linear-gradient(90deg, #4ECDC4, #A78BFA)",
              transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: `0 0 12px ${percentSpent > 90 ? "rgba(255,107,107,0.4)" : "rgba(78,205,196,0.4)"}`,
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <span style={{ fontSize: "11px", color: "#6B7280" }}>Spent: {formatCurrency(totalSpent)}</span>
            <span style={{ fontSize: "11px", color: "#6B7280", fontFamily: "'Space Mono', monospace" }}>{percentSpent.toFixed(0)}%</span>
          </div>
        </div>

        {/* Today's Spending */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px", padding: "18px 20px",
          border: "1px solid rgba(255,255,255,0.05)",
          marginBottom: "16px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <p style={{ fontSize: "11px", color: "#6B7280", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>Today's Spending</p>
            <p style={{ fontSize: "24px", fontWeight: 700, margin: "4px 0 0", fontFamily: "'Space Mono', monospace" }}>
              {formatCurrency(todayTotal)}
            </p>
          </div>
          <div style={{ fontSize: "12px", color: "#6B7280" }}>
            {todayExpenses.length} transaction{todayExpenses.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Weekly Chart */}
        <div style={{
          background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "20px",
          border: "1px solid rgba(255,255,255,0.05)", marginBottom: "16px",
        }}>
          <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 16px", color: "#9CA3AF" }}>This Week</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "100px" }}>
            {weekData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "10px", fontFamily: "'Space Mono', monospace", color: "#6B7280" }}>
                  {d.total > 0 ? formatCurrency(d.total).replace("₹", "") : ""}
                </span>
                <div style={{
                  width: "100%", borderRadius: "6px",
                  height: `${Math.max((d.total / maxWeekDay) * 70, d.total > 0 ? 8 : 3)}px`,
                  background: d.isToday
                    ? "linear-gradient(180deg, #4ECDC4, #A78BFA)"
                    : d.total > 0 ? "rgba(78,205,196,0.3)" : "rgba(255,255,255,0.04)",
                  transition: "height 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: d.isToday ? "0 4px 12px rgba(78,205,196,0.3)" : "none",
                }} />
                <span style={{
                  fontSize: "10px", fontWeight: d.isToday ? 700 : 400,
                  color: d.isToday ? "#4ECDC4" : "#6B7280",
                }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        {categoryTotals.length > 0 && (
          <div style={{
            background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "20px",
            border: "1px solid rgba(255,255,255,0.05)", marginBottom: "16px",
          }}>
            <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 14px", color: "#9CA3AF" }}>By Category</p>
            {categoryTotals.map((cat, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: i < categoryTotals.length - 1 ? "12px" : 0 }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: `${cat.color}15`, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "16px", flexShrink: 0,
                }}>{cat.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 500 }}>{cat.name}</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Space Mono', monospace" }}>
                      {formatCurrency(cat.total)}
                    </span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.04)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: "2px",
                      width: `${(cat.total / totalSpent) * 100}%`,
                      background: cat.color,
                      transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Transactions */}
        {todayExpenses.length > 0 && (
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 12px", color: "#9CA3AF" }}>Today's Transactions</p>
            {todayExpenses.map((exp) => {
              const cat = CATEGORIES.find((c) => c.name === exp.category);
              return (
                <div key={exp.id} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "14px 16px", borderRadius: "14px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  marginBottom: "8px", cursor: "pointer",
                  transition: "all 0.2s ease",
                }} onClick={() => handleEdit(exp)}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "12px",
                    background: `${cat?.color || "#666"}12`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", flexShrink: 0,
                  }}>{cat?.icon || "📦"}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "14px", fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{exp.description}</p>
                    <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0" }}>{cat?.name}</p>
                  </div>
                  <p style={{ fontSize: "15px", fontWeight: 700, margin: 0, fontFamily: "'Space Mono', monospace", color: "#FF6B6B" }}>
                    -{formatCurrency(exp.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {expenses.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>💸</div>
            <p style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 6px" }}>No expenses yet</p>
            <p style={{ fontSize: "13px", color: "#6B7280" }}>Tap the + button to add your first expense</p>
          </div>
        )}
      </>
    )}

    {/* === HISTORY VIEW === */}
    {view === "history" && (
      <>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
          {["All", ...CATEGORIES.map((c) => c.name)].map((cat) => (
            <button key={cat} onClick={() => setFilterCat(cat)} style={{
              padding: "6px 14px", borderRadius: "20px", border: "none",
              background: filterCat === cat ? "rgba(78,205,196,0.15)" : "rgba(255,255,255,0.04)",
              color: filterCat === cat ? "#4ECDC4" : "#6B7280",
              fontSize: "11px", fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit",
              border: filterCat === cat ? "1px solid rgba(78,205,196,0.2)" : "1px solid transparent",
              transition: "all 0.2s ease",
            }}>
              {cat === "All" ? "All" : CATEGORIES.find((c) => c.name === cat)?.icon + " " + cat}
            </button>
          ))}
        </div>

        {filteredExpenses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ fontSize: "14px", color: "#6B7280" }}>No expenses found</p>
          </div>
        ) : (
          filteredExpenses.map((exp) => {
            const cat = CATEGORIES.find((c) => c.name === exp.category);
            const d = new Date(exp.date);
            return (
              <div key={exp.id} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "14px 16px", borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.04)",
                marginBottom: "8px",
                transition: "all 0.2s ease",
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "12px",
                  background: `${cat?.color || "#666"}12`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", flexShrink: 0,
                }}>{cat?.icon || "📦"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "14px", fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{exp.description}</p>
                  <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0" }}>
                    {d.getDate()} {MONTHS[d.getMonth()]} · {cat?.name}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <p style={{ fontSize: "15px", fontWeight: 700, margin: 0, fontFamily: "'Space Mono', monospace", color: "#FF6B6B" }}>
                    -{formatCurrency(exp.amount)}
                  </p>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button onClick={() => handleEdit(exp)} style={{
                      width: "28px", height: "28px", borderRadius: "8px",
                      background: "rgba(78,205,196,0.1)", border: "none",
                      color: "#4ECDC4", cursor: "pointer", fontSize: "12px",
                    }}>✏️</button>
                    <button onClick={() => handleDelete(exp.id)} style={{
                      width: "28px", height: "28px", borderRadius: "8px",
                      background: "rgba(255,107,107,0.1)", border: "none",
                      color: "#FF6B6B", cursor: "pointer", fontSize: "12px",
                    }}>🗑️</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </>
    )}

    {/* === INSIGHTS VIEW === */}
    {view === "insights" && (
      <>
        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "Total Transactions", value: monthExpenses.length, color: "#4ECDC4" },
            { label: "Avg per Transaction", value: monthExpenses.length > 0 ? formatCurrency(totalSpent / monthExpenses.length) : "₹0", color: "#A78BFA" },
            { label: "Daily Average", value: formatCurrency(totalSpent / new Date().getDate()), color: "#FBBF24" },
            { label: "Biggest Expense", value: monthExpenses.length > 0 ? formatCurrency(Math.max(...monthExpenses.map((e) => e.amount))) : "₹0", color: "#FF6B6B" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "18px",
              border: "1px solid rgba(255,255,255,0.05)",
            }}>
              <p style={{ fontSize: "11px", color: "#6B7280", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</p>
              <p style={{ fontSize: "20px", fontWeight: 700, margin: "6px 0 0", fontFamily: "'Space Mono', monospace", color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Top Category */}
        {categoryTotals.length > 0 && (
          <div style={{
            background: `linear-gradient(135deg, ${categoryTotals[0].color}15, ${categoryTotals[0].color}05)`,
            borderRadius: "16px", padding: "20px",
            border: `1px solid ${categoryTotals[0].color}20`,
            marginBottom: "16px",
          }}>
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "1px" }}>🏆 Top Spending Category</p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "32px" }}>{categoryTotals[0].icon}</span>
              <div>
                <p style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>{categoryTotals[0].name}</p>
                <p style={{ fontSize: "14px", color: categoryTotals[0].color, margin: "2px 0 0", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
                  {formatCurrency(categoryTotals[0].total)} · {((categoryTotals[0].total / totalSpent) * 100).toFixed(0)}% of total
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Budget Health */}
        <div style={{
          background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "20px",
          border: "1px solid rgba(255,255,255,0.05)", marginBottom: "16px",
        }}>
          <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 12px", color: "#9CA3AF" }}>Budget Health</p>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              fontSize: "36px",
              filter: percentSpent > 90 ? "none" : "none",
            }}>
              {percentSpent > 90 ? "🔴" : percentSpent > 70 ? "🟡" : "🟢"}
            </div>
            <div>
              <p style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>
                {percentSpent > 90 ? "Over Budget Zone!" : percentSpent > 70 ? "Getting Tight" : "Looking Good!"}
              </p>
              <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0" }}>
                {percentSpent > 90
                  ? "Time to cut back on spending this month."
                  : percentSpent > 70
                  ? `Only ${formatCurrency(remaining)} left for the rest of the month.`
                  : `You still have ${formatCurrency(remaining)} to spend wisely.`}
              </p>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        {categoryTotals.length > 0 && (
          <div style={{
            background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "20px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 14px", color: "#9CA3AF" }}>Category Distribution</p>
            {/* Stacked bar */}
            <div style={{ display: "flex", height: "12px", borderRadius: "6px", overflow: "hidden", marginBottom: "14px" }}>
              {categoryTotals.map((cat, i) => (
                <div key={i} style={{
                  width: `${(cat.total / totalSpent) * 100}%`,
                  background: cat.color,
                  transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                }} />
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {categoryTotals.map((cat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: cat.color }} />
                  <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
                    {cat.icon} {((cat.total / totalSpent) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {expenses.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📈</div>
            <p style={{ fontSize: "14px", color: "#6B7280" }}>Add some expenses to see insights</p>
          </div>
        )}
      </>
    )}
  </div>

  {/* FAB - Add Button */}
  <button onClick={() => { setEditingId(null); setAmount(""); setDescription(""); setSelectedCat(0); setSelectedDate(new Date().toISOString().split("T")[0]); setShowAdd(true); }} style={{
    position: "fixed", bottom: "28px", right: "50%", transform: "translateX(50%)",
    width: "60px", height: "60px", borderRadius: "20px",
    background: "linear-gradient(135deg, #4ECDC4, #A78BFA)",
    border: "none", color: "white", fontSize: "28px", cursor: "pointer",
    boxShadow: "0 8px 30px rgba(78,205,196,0.4), 0 2px 8px rgba(0,0,0,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    zIndex: 50,
    fontWeight: 300,
  }}>
    +
  </button>

  {/* Add/Edit Modal */}
  {showAdd && (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={(e) => { if (e.target === e.currentTarget) setShowAdd(false); }}>
      <div style={{
        width: "100%", maxWidth: "480px",
        background: "linear-gradient(180deg, #1e1e35 0%, #161625 100%)",
        borderRadius: "24px 24px 0 0", padding: "28px 24px 36px",
        border: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "none",
      }}>
        {/* Handle */}
        <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.15)", margin: "0 auto 20px" }} />
        <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 20px" }}>
          {editingId ? "Edit Expense" : "Add Expense"}
        </h2>

        {/* Amount */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "11px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>Amount (₹)</label>
          <input ref={inputRef} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0"
            style={{
              width: "100%", padding: "14px 16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)", color: "#E8E8F0", fontSize: "24px", fontWeight: 700,
              fontFamily: "'Space Mono', monospace", outline: "none", marginTop: "8px", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "11px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What did you spend on?"
            style={{
              width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)", color: "#E8E8F0", fontSize: "14px",
              fontFamily: "inherit", outline: "none", marginTop: "8px", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Date */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "11px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>Date</label>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)", color: "#E8E8F0", fontSize: "14px",
              fontFamily: "inherit", outline: "none", marginTop: "8px", boxSizing: "border-box",
              colorScheme: "dark",
            }}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "11px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>Category</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginTop: "10px" }}>
            {CATEGORIES.map((cat, i) => (
              <button key={i} onClick={() => setSelectedCat(i)} style={{
                padding: "10px 4px", borderRadius: "12px", border: "none",
                background: selectedCat === i ? `${cat.color}20` : "rgba(255,255,255,0.03)",
                border: selectedCat === i ? `1.5px solid ${cat.color}40` : "1.5px solid transparent",
                cursor: "pointer", transition: "all 0.2s ease",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
              }}>
                <span style={{ fontSize: "20px" }}>{cat.icon}</span>
                <span style={{ fontSize: "9px", color: selectedCat === i ? cat.color : "#6B7280", fontWeight: 600, fontFamily: "inherit" }}>
                  {cat.name.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setShowAdd(false)} style={{
            flex: 1, padding: "14px", borderRadius: "14px",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            color: "#9CA3AF", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Cancel</button>
          <button onClick={handleAdd} style={{
            flex: 2, padding: "14px", borderRadius: "14px",
            background: "linear-gradient(135deg, #4ECDC4, #A78BFA)",
            border: "none", color: "white", fontSize: "15px", fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 4px 15px rgba(78,205,196,0.3)",
          }}>
            {editingId ? "Update" : "Add Expense"}
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Budget Edit Modal */}
  {showBudgetEdit && (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }} onClick={(e) => { if (e.target === e.currentTarget) setShowBudgetEdit(false); }}>
      <div style={{
        width: "100%", maxWidth: "360px",
        background: "linear-gradient(180deg, #1e1e35 0%, #161625 100%)",
        borderRadius: "20px", padding: "28px 24px",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 16px" }}>Set Monthly Budget</h3>
        <input type="number" value={tempBudget} onChange={(e) => setTempBudget(e.target.value)} placeholder="30000"
          style={{
            width: "100%", padding: "14px 16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)", color: "#E8E8F0", fontSize: "22px", fontWeight: 700,
            fontFamily: "'Space Mono', monospace", outline: "none", marginBottom: "16px", boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setShowBudgetEdit(false)} style={{
            flex: 1, padding: "12px", borderRadius: "12px",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            color: "#9CA3AF", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Cancel</button>
          <button onClick={() => { setBudget(Number(tempBudget) || 30000); setShowBudgetEdit(false); }} style={{
            flex: 1, padding: "12px", borderRadius: "12px",
            background: "linear-gradient(135deg, #4ECDC4, #A78BFA)", border: "none",
            color: "white", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}>Save</button>
        </div>
      </div>
    </div>
  )}
</div>
```

);
}

export default ExpenseTracker;
