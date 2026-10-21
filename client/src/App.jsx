
import { useCallback, useEffect, useState } from "react";
import {
  Wallet,
  Users,
  LayoutDashboard,
  CreditCard,
  FileText,
  Search,
  Plus,
  RefreshCw
} from "lucide-react";
import "./App.css";

const API = "http://localhost:5000/api";

function money(value = 0) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
  }).format(value);
}

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalMembers: 0,
    totalCollected: 0,
    outstandingBalance: 0,
    fullyPaid: 0
  });
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [memberForm, setMemberForm] = useState({
    studentNumber: "",
    name: "",
    section: "",
    totalDues: "100"
  });

  const [paymentForm, setPaymentForm] = useState({
    memberId: "",
    amount: ""
  });

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [memberData, paymentData, summaryData] = await Promise.all([
        request("/members"),
        request("/payments"),
        request("/reports/summary")
      ]);

      setMembers(memberData);
      setPayments(paymentData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addMember(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    try {
      await request("/members", {
        method: "POST",
        body: JSON.stringify({
          ...memberForm,
          totalDues: Number(memberForm.totalDues)
        })
      });

      setMemberForm({
        studentNumber: "",
        name: "",
        section: "",
        totalDues: "100"
      });

      setNotice("Member registered successfully.");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function recordPayment(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    try {
      const result = await request("/payments", {
        method: "POST",
        body: JSON.stringify({
          memberId: paymentForm.memberId,
          amount: Number(paymentForm.amount)
        })
      });

      setNotice(
        `Payment saved. Reference: ${result.payment.reference}`
      );

      setPaymentForm({
        memberId: "",
        amount: ""
      });

      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredMembers = members.filter((member) => {
    const query = search.toLowerCase();

    return (
      member.name.toLowerCase().includes(query) ||
      member.studentNumber.toLowerCase().includes(query) ||
      (member.section || "").toLowerCase().includes(query)
    );
  });

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "members", label: "Members", icon: Users },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "reports", label: "Reports", icon: FileText }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Wallet size={24} />
          </div>
          <div>
            <h1>OrgLedger</h1>
            <span>Dues Management</span>
          </div>
        </div>

        <p className="nav-heading">WORKSPACE</p>

        <nav>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""}`}
              onClick={() => {
                setPage(id);
                setNotice("");
                setError("");
              }}
            >
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          Local application
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">ORGANIZATION MANAGEMENT</p>
            <h2>
              {navItems.find((item) => item.id === page)?.label}
            </h2>
          </div>

          <button
            className="secondary-button"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {error && (
          <div className="alert error" role="alert">
            {error}
            <button onClick={() => setError("")}>Dismiss</button>
          </div>
        )}

        {notice && (
          <div className="alert success" role="status">
            {notice}
            <button onClick={() => setNotice("")}>Dismiss</button>
          </div>
        )}

        {page === "dashboard" && (
          <>
            <section className="welcome-panel">
              <div>
                <p className="eyebrow light">TREASURER OVERVIEW</p>
                <h3>Keep your organization's dues organized.</h3>
                <p>
                  Manage member records, track payments, and monitor
                  outstanding balances in one place.
                </p>
              </div>
              <Wallet size={58} strokeWidth={1.4} />
            </section>

            <section className="stat-grid">
              <StatCard
                title="Total Members"
                value={summary.totalMembers}
                icon={<Users />}
              />
              <StatCard
                title="Total Collected"
                value={money(summary.totalCollected)}
                icon={<Wallet />}
              />
              <StatCard
                title="Outstanding"
                value={money(summary.outstandingBalance)}
                icon={<CreditCard />}
              />
              <StatCard
                title="Fully Paid"
                value={summary.fullyPaid}
                icon={<FileText />}
              />
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Recent Payments</h3>
                  <p>Latest recorded dues transactions</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setPage("payments")}
                >
                  View all
                </button>
              </div>

              <PaymentTable payments={payments.slice(0, 5)} />
            </section>
          </>
        )}

        {page === "members" && (
          <div className="content-grid">
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Member Directory</h3>
                  <p>Search registered organization members.</p>
                </div>
              </div>

              <div className="search-box">
                <Search size={18} />
                <input
                  placeholder="Search name, student number, or section"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Student No.</th>
                      <th>Name</th>
                      <th>Section</th>
                      <th>Balance</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr key={member._id}>
                        <td>{member.studentNumber}</td>
                        <td>{member.name}</td>
                        <td>{member.section || "—"}</td>
                        <td>{money(member.balance)}</td>
                        <td>
                          <Status status={member.status} />
                        </td>
                      </tr>
                    ))}
                    {filteredMembers.length === 0 && (
                      <tr>
                        <td colSpan="5" className="empty">
                          No members found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel form-panel">
              <div className="panel-heading">
                <div>
                  <h3>Register Member</h3>
                  <p>Add a new organization member.</p>
                </div>
                <Plus size={20} />
              </div>

              <form onSubmit={addMember}>
                <label>
                  Student Number *
                  <input
                    required
                    value={memberForm.studentNumber}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        studentNumber: e.target.value
                      })
                    }
                    placeholder="e.g. 2026-001"
                  />
                </label>

                <label>
                  Full Name *
                  <input
                    required
                    value={memberForm.name}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        name: e.target.value
                      })
                    }
                    placeholder="Enter full name"
                  />
                </label>

                <label>
                  Section
                  <input
                    value={memberForm.section}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        section: e.target.value
                      })
                    }
                    placeholder="e.g. BSIT 3-A"
                  />
                </label>

                <label>
                  Total Dues (₱) *
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={memberForm.totalDues}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        totalDues: e.target.value
                      })
                    }
                  />
                </label>

                <button className="primary-button" type="submit">
                  <Plus size={17} />
                  Add Member
                </button>
              </form>
            </section>
          </div>
        )}

        {page === "payments" && (
          <div className="content-grid">
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Payment History</h3>
                  <p>Recorded payments and reference numbers.</p>
                </div>
              </div>
              <PaymentTable payments={payments} />
            </section>

            <section className="panel form-panel">
              <div className="panel-heading">
                <div>
                  <h3>Record Payment</h3>
                  <p>Record dues received from a member.</p>
                </div>
                <CreditCard size={20} />
              </div>

              <form onSubmit={recordPayment}>
                <label>
                  Select Member *
                  <select
                    required
                    value={paymentForm.memberId}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        memberId: e.target.value
                      })
                    }
                  >
                    <option value="">Choose a member</option>
                    {members
                      .filter((member) => member.balance > 0)
                      .map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.studentNumber} — {member.name} (
                          {money(member.balance)} remaining)
                        </option>
                      ))}
                  </select>
                </label>

                <label>
                  Amount Received (₱) *
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        amount: e.target.value
                      })
                    }
                    placeholder="Enter payment amount"
                  />
                </label>

                <button className="primary-button" type="submit">
                  <CreditCard size={17} />
                  Save Payment
                </button>
              </form>

              <div className="info-note">
                The system generates a unique reference after the
                payment is saved. Verify the amount before recording.
              </div>
            </section>
          </div>
        )}

        {page === "reports" && (
          <>
            <section className="stat-grid">
              <StatCard
                title="Registered Members"
                value={summary.totalMembers}
                icon={<Users />}
              />
              <StatCard
                title="Collected Dues"
                value={money(summary.totalCollected)}
                icon={<Wallet />}
              />
              <StatCard
                title="Outstanding Dues"
                value={money(summary.outstandingBalance)}
                icon={<FileText />}
              />
              <StatCard
                title="Fully Paid Members"
                value={summary.fullyPaid}
                icon={<CreditCard />}
              />
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Collection Summary</h3>
                  <p>Summary calculated from stored member and payment data.</p>
                </div>
              </div>

              <div className="report-row">
                <span>Total members</span>
                <strong>{summary.totalMembers}</strong>
              </div>
              <div className="report-row">
                <span>Total dues expected</span>
                <strong>
                  {money(
                    summary.totalCollected + summary.outstandingBalance
                  )}
                </strong>
              </div>
              <div className="report-row">
                <span>Total collected</span>
                <strong>{money(summary.totalCollected)}</strong>
              </div>
              <div className="report-row">
                <span>Outstanding balance</span>
                <strong>{money(summary.outstandingBalance)}</strong>
              </div>
            </section>
          </>
        )}

        <footer className="app-footer">
          OrgLedger · Organization Dues Tracker · IPT 102
        </footer>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <div className="stat-icon">{icon}</div>
      </div>
      <strong>{value}</strong>
    </article>
  );
}

function Status({ status }) {
  const className = status.toLowerCase();

  return <span className={`status-badge ${className}`}>{status}</span>;
}

function PaymentTable({ payments }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Reference</th>
            <th>Member</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td className="reference">{payment.reference}</td>
              <td>
                {payment.member?.name || "Member record unavailable"}
              </td>
              <td>
                {new Date(payment.paymentDate).toLocaleDateString("en-PH")}
              </td>
              <td>{money(payment.amount)}</td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td colSpan="4" className="empty">
                No payments recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
