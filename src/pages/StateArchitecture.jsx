import React from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  Database,
  Cpu,
  Zap,
  CheckCircle2,
  Info,
  Server,
  ShoppingCart,
  ShieldCheck,
  Code,
  Activity,
} from "../components/Icons";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { useCartStore } from "../store/useCartStore";
import { Card, Header, Status, Button } from "../components/UI";

export default function StateArchitecture() {
  const { loggedIn, currentUser } = useAuth();
  const { devices, liveMetrics, unreadCount, activityLogs } = useData();
  const { items, getTotalItemsCount, orders } = useCartStore();

  const cartUnits = getTotalItemsCount();

  return (
    <div className="state-arch-wrapper">
      {/* Top Banner */}
      <div className="state-banner">
        <div className="banner-left">
          <div className="banner-tag">
            <Layers size={14} /> Course 25CSE0203 • Front End Engineering-II
          </div>
          <h2>React State Architecture & Viva Reference</h2>
          <p>
            Complete architectural guide explaining <b>Global vs. Local State</b>, <b>Context API</b>,{" "}
            <b>Zustand</b>, and <b>Async State Lifecycle</b> with real-time live store inspection.
          </p>
        </div>
        <div className="banner-right">
          <Link to="/cart" className="btn btn-primary">
            <ShoppingCart size={15} /> Open Requisition Cart
          </Link>
        </div>
      </div>

      {/* 3-Tier State Architecture Diagram */}
      <Card style={{ margin: "24px 0" }}>
        <Header
          title="State Architecture in React: The 3 Tiers"
          subtitle="How NetFlow organizes and manages application data at scale"
        />

        <div className="tier-grid">
          {/* Tier 1 */}
          <div className="tier-card">
            <div className="tier-badge t1">Tier 1: Local State</div>
            <h3>Component State (useState, useReducer)</h3>
            <p>
              Transient, self-contained UI state that does not need to be shared across unrelated components.
            </p>
            <div className="tier-examples">
              <b>Used In NetFlow For:</b>
              <ul>
                <li>Modal visibility toggles (<code>showModal</code>)</li>
                <li>Search filter input strings (<code>q</code>, <code>filter</code>)</li>
                <li>Ping diagnostic line streams</li>
                <li>Form input values and touched states</li>
              </ul>
            </div>
            <div className="tier-footer">
              <span className="pill-tool">useState</span>
              <span className="pill-tool">useRef</span>
              <span className="pill-tool">useForm</span>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="tier-card highlight-tier">
            <div className="tier-badge t2">Tier 2: React Context API</div>
            <h3>Subtree & Session State (createContext)</h3>
            <p>
              Broadly-needed application context where updates are infrequent or broadcast to the entire UI shell.
            </p>
            <div className="tier-examples">
              <b>Used In NetFlow For:</b>
              <ul>
                <li>
                  <code>AuthContext</code>: Current user profile, session, authentication guards
                </li>
                <li>
                  <code>DataContext</code>: Rolling 3.5s telemetry loop, device inventory, incident list
                </li>
                <li>Theme preferences (dark/light mode)</li>
              </ul>
            </div>
            <div className="tier-footer">
              <span className="pill-tool">AuthContext</span>
              <span className="pill-tool">DataContext</span>
              <span className="pill-tool">useContext</span>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="tier-card">
            <div className="tier-badge t3">Tier 3: External Global Store</div>
            <h3>Fine-Grained Store (Zustand)</h3>
            <p>
              High-frequency, slice-based state requiring selective subscriptions without tree-wide re-renders.
            </p>
            <div className="tier-examples">
              <b>Used In NetFlow For:</b>
              <ul>
                <li>
                  <code>useCartStore</code>: Requisition cart items, quantities, duration modifiers
                </li>
                <li>LocalStorage persistence middleware</li>
                <li>Atomic checkout and order synchronization</li>
              </ul>
            </div>
            <div className="tier-footer">
              <span className="pill-tool">Zustand</span>
              <span className="pill-tool">Selectors</span>
              <span className="pill-tool">Slice Pattern</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Live State Inspector */}
      <Card style={{ margin: "24px 0" }}>
        <Header
          title="Live State Inspector (Real-Time Application Memory)"
          subtitle="Inspect actual live values from Context API and Zustand currently active in this browser session"
        />

        <div className="inspector-grid">
          {/* AuthContext Memory */}
          <div className="inspector-box">
            <div className="inspector-head">
              <ShieldCheck size={16} color="var(--primary)" />
              <b>AuthContext Memory</b>
            </div>
            <div className="inspector-kv">
              <span>Authentication Status:</span>
              <Status value={loggedIn ? "Active" : "Offline"} />
            </div>
            <div className="inspector-kv">
              <span>Current User:</span>
              <b>{currentUser?.name || "Not logged in"}</b>
            </div>
            <div className="inspector-kv">
              <span>User Email:</span>
              <span className="mono">{currentUser?.email || "—"}</span>
            </div>
            <div className="inspector-kv">
              <span>Access Role:</span>
              <span className="role">{currentUser?.role || "Student"}</span>
            </div>
          </div>

          {/* DataContext Memory */}
          <div className="inspector-box">
            <div className="inspector-head">
              <Activity size={16} color="var(--success)" />
              <b>DataContext Memory</b>
            </div>
            <div className="inspector-kv">
              <span>Registered Devices:</span>
              <b>{devices.length} Devices</b>
            </div>
            <div className="inspector-kv">
              <span>Live Bandwidth:</span>
              <b className="mono">{liveMetrics.bandwidth}</b>
            </div>
            <div className="inspector-kv">
              <span>Network Latency:</span>
              <b>{liveMetrics.latency} ms</b>
            </div>
            <div className="inspector-kv">
              <span>Unread Alerts:</span>
              <b>{unreadCount} notifications</b>
            </div>
          </div>

          {/* Zustand useCartStore Memory */}
          <div className="inspector-box">
            <div className="inspector-head">
              <ShoppingCart size={16} color="var(--warning)" />
              <b>Zustand (useCartStore) Memory</b>
            </div>
            <div className="inspector-kv">
              <span>Unique Cart Items:</span>
              <b>{items.length} types</b>
            </div>
            <div className="inspector-kv">
              <span>Total Units Selected:</span>
              <b>{cartUnits} units</b>
            </div>
            <div className="inspector-kv">
              <span>Completed Requisitions:</span>
              <b>{orders.length} orders</b>
            </div>
            <div className="inspector-kv">
              <span>Storage Sync:</span>
              <span className="good">LocalStorage Synced</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Comparative Evaluation Matrix */}
      <Card style={{ margin: "24px 0" }}>
        <Header
          title="State Management Comparative Matrix (For Viva Assessment)"
          subtitle="Technical comparison between Context API, Zustand, and Redux Toolkit"
        />

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Criterion</th>
                <th>React Context API</th>
                <th>Zustand (Implemented in Cart)</th>
                <th>Redux Toolkit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Bundle Footprint</b></td>
                <td>0 kB (Built into React core)</td>
                <td>~1.2 kB (Ultra lightweight)</td>
                <td>~11 kB (+ react-redux)</td>
              </tr>
              <tr>
                <td><b>Boilerplate</b></td>
                <td>Moderate (Provider, Context, custom hook)</td>
                <td>Minimal (Create function, direct hook)</td>
                <td>High (Slices, reducers, dispatch, configureStore)</td>
              </tr>
              <tr>
                <td><b>Re-render Performance</b></td>
                <td>All consumers re-render on value change</td>
                <td>Fine-grained selectors prevent unneeded renders</td>
                <td>Selector-based (useSelector memoization)</td>
              </tr>
              <tr>
                <td><b>Best Suited For</b></td>
                <td>Auth, themes, language, low-frequency data</td>
                <td>Shopping carts, widgets, high-frequency state</td>
                <td>Massive enterprise applications with 50+ stores</td>
              </tr>
              <tr>
                <td><b>Usage in NetFlow</b></td>
                <td><code>AuthContext</code> & <code>DataContext</code></td>
                <td><code>useCartStore</code> (Equipment Cart)</td>
                <td>Evaluated & compared for Front End-II</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Viva / Assessment Questions & Answers */}
      <Card style={{ margin: "24px 0" }}>
        <Header
          title="Top 5 Viva Questions & Answers for Front End Engineering-II"
          subtitle="Quick reference for your project presentation and viva evaluation (25 Marks)"
        />

        <div className="viva-qa-list">
          <div className="qa-item">
            <h4>Q1: What is the difference between Local State and Global State?</h4>
            <p>
              <b>Answer:</b> <i>Local state</i> is scoped to a single component (like input fields or modal open/close toggles using <code>useState</code>). <i>Global state</i> is shared across multiple disparate branches of the component tree (like user authentication in <code>AuthContext</code> or shopping cart items in <code>useCartStore</code>).
            </p>
          </div>

          <div className="qa-item">
            <h4>Q2: Why use Zustand instead of Context API for a Shopping Cart?</h4>
            <p>
              <b>Answer:</b> In React Context API, every component consuming the context re-renders whenever any property of the context value changes. Zustand utilizes atomic subscriptions with selector functions (e.g., <code>useCartStore(state =&gt; state.items.length)</code>), ensuring only the specific components watching that slice re-render.
            </p>
          </div>

          <div className="qa-item">
            <h4>Q3: How do you handle Asynchronous State in React?</h4>
            <p>
              <b>Answer:</b> Asynchronous state is modeled using a finite state machine representing four states: <code>idle</code>, <code>loading</code>, <code>success</code>, and <code>error</code>. In NetFlow, the custom <code>useAsync</code> hook manages these transitions, providing skeleton screens during loading and retry actions upon error.
            </p>
          </div>

          <div className="qa-item">
            <h4>Q4: How does React Router facilitate Multi-Page SPA design?</h4>
            <p>
              <b>Answer:</b> React Router intercepts browser URL changes and swaps component trees using client-side routing without triggering full browser page reloads. The application shell uses <code>&lt;Outlet /&gt;</code> for nested views, <code>useParams</code> for dynamic parameters (like <code>/portfolio/:projectId</code>), and <code>ProtectedRoute</code> guards for access control.
            </p>
          </div>

          <div className="qa-item">
            <h4>Q5: What validation strategies are implemented in your form handling?</h4>
            <p>
              <b>Answer:</b> We implement controlled components wrapped in reusable form primitives (<code>TextInput</code>, <code>SelectField</code>, <code>TextareaField</code>). The validation strategy encompasses RFC 5322 regex email checking, strict IPv4 regex format checking, length limits, on-blur touch marking, real-time error clearance on edit, and submit prevention until all rules pass.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
