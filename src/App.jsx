import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// During development (npm run dev), Vite runs on its own port (5173) while
// PHP/Apache runs on a different one (80 or 8080). So we point this at the
// full backend URL, not a relative path. Change this if your setup differs.
const API_BASE = "http://localhost/expense-tracker/backend";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "", amount: "", category: "Food", type: "expense",
    expense_date: new Date().toISOString().slice(0, 10),
  });

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const categories = ["Food", "Transport", "Bills", "Shopping", "Health", "Income", "Other"];

  async function loadExpenses() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/get_expenses.php`);
      if (!res.ok) throw new Error("Could not reach the server.");
      const data = await res.json();
      setExpenses(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadExpenses(); }, []);

  useEffect(() => {
    if (!chartRef.current || expenses.length === 0) return;
    const byCategory = {};
    expenses.filter(e => e.type === "expense").forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + parseFloat(e.amount);
    });

    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels: Object.keys(byCategory),
        datasets: [{
          data: Object.values(byCategory),
          backgroundColor: ["#A4402A","#C99A3B","#2F6B4F","#5B6F8C","#8C5B7F","#6B7A4F","#B0794A"],
          borderColor: "#FFFDF7",
          borderWidth: 2,
        }]
      },
      options: {
        plugins: { legend: { position: "bottom", labels: { font: { family: "IBM Plex Mono" }, color: "#1F2A24" } } }
      }
    });

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [expenses]);

  const totalIncome = expenses.filter(e => e.type === "income").reduce((s, e) => s + parseFloat(e.amount), 0);
  const totalExpense = expenses.filter(e => e.type === "expense").reduce((s, e) => s + parseFloat(e.amount), 0);
  const balance = totalIncome - totalExpense;

  function resetForm() {
    setForm({ title: "", amount: "", category: "Food", type: "expense", expense_date: new Date().toISOString().slice(0, 10) });
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.amount) return;

    const payload = { ...form, amount: parseFloat(form.amount) };
    const url = editingId ? `${API_BASE}/update_expense.php` : `${API_BASE}/add_expense.php`;
    if (editingId) payload.id = editingId;

    try {
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      resetForm();
      loadExpenses();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API_BASE}/delete_expense.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      loadExpenses();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(entry) {
    setEditingId(entry.id);
    setForm({
      title: entry.title,
      amount: entry.amount,
      category: entry.category,
      type: entry.type,
      expense_date: entry.expense_date,
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      <header className="mb-8 border-b border-dashed border-rule pb-4">
        <p className="text-xs tracking-widest uppercase text-accent">Personal Finance</p>
        <h1 className="font-display text-4xl font-bold">Ledger</h1>
        <p className="text-sm opacity-70 mt-1">Every entry, accounted for.</p>
      </header>

      {error && (
        <div className="mb-6 px-4 py-3 ledger-card border-l-4 border-expense">
          <span className="font-semibold">Couldn't complete that:</span> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="ledger-card p-5">
          <p className="text-xs uppercase opacity-60">Income</p>
          <p className="text-2xl font-display font-semibold text-income">₹{totalIncome.toFixed(2)}</p>
        </div>
        <div className="ledger-card p-5">
          <p className="text-xs uppercase opacity-60">Expense</p>
          <p className="text-2xl font-display font-semibold text-expense">₹{totalExpense.toFixed(2)}</p>
        </div>
        <div className="ledger-card p-5">
          <p className="text-xs uppercase opacity-60">Balance</p>
          <p className="text-2xl font-display font-semibold">₹{balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div>
          <h2 className="font-display text-xl mb-3">{editingId ? "Edit entry" : "Add an entry"}</h2>
          <form onSubmit={handleSubmit} className="ledger-card p-5 space-y-3">
            <div>
              <label className="text-xs uppercase opacity-60">Title</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Groceries, Salary, Rent..." required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase opacity-60">Amount (₹)</label>
                <input type="number" step="0.01" className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs uppercase opacity-60">Date</label>
                <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  value={form.expense_date} onChange={e => setForm({ ...form, expense_date: e.target.value })} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase opacity-60">Category</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase opacity-60">Type</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="px-4 py-2 rounded text-white font-medium bg-ink">
                {editingId ? "Save changes" : "Add entry"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded border border-gray-300">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <h2 className="font-display text-xl mt-8 mb-3">Spending by category</h2>
          <div className="ledger-card p-5">
            {expenses.filter(e => e.type === "expense").length > 0
              ? <canvas ref={chartRef} height="220"></canvas>
              : <p className="text-sm opacity-60">Add an expense to see the breakdown.</p>}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl mb-3">Entries</h2>
          <div className="ledger-card divide-y divide-rule">
            {loading ? (
              <p className="p-5 text-sm opacity-60">Loading...</p>
            ) : expenses.length === 0 ? (
              <p className="p-5 text-sm opacity-60">No entries yet. Add your first one.</p>
            ) : (
              expenses.map(entry => (
                <div key={entry.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{entry.title}</p>
                    <p className="text-xs opacity-60">{entry.category} · {entry.expense_date}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`font-semibold ${entry.type === "income" ? "text-income" : "text-expense"}`}>
                      {entry.type === "income" ? "+" : "−"}₹{parseFloat(entry.amount).toFixed(2)}
                    </span>
                    <button onClick={() => handleEdit(entry)} className="text-xs underline opacity-70 hover:opacity-100">Edit</button>
                    <button onClick={() => handleDelete(entry.id)} className="text-xs underline opacity-70 hover:opacity-100 text-expense">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}