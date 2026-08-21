import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ClearlistLogo from './components/ClearlistLogo';

import {
  clearAuthError,
  clearTasks,
  createTask,
  fetchTasks,
  loadUser,
  loginUser,
  logout,
  registerUser,
  removeTask,
} from './app/store';

function Brand() {
  return (
    <a className="brand" href="/" aria-label="Clearlist home">
      <ClearlistLogo className="brand-logo" />

      <span className="brand-name">
        <span>Clear</span>
        <strong>list</strong>
      </span>

      <span className="brand-version">02</span>
    </a>
  );
}

function MenuGlyph({ open }) {
  return (
    <svg
      className={`menu-glyph ${open ? 'is-open' : ''}`}
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        className="menu-frame"
        d="M15 9H34C37.3 9 40 11.7 40 15V34"
      />

      <path className="menu-line menu-line-one" d="M15 18H32" />
      <path className="menu-line menu-line-two" d="M15 24H28" />
      <path className="menu-line menu-line-three" d="M15 30H34" />

      <circle className="menu-accent" cx="38" cy="10" r="2.5" />

      <path className="menu-close menu-close-one" d="M15 15L33 33" />
      <path className="menu-close menu-close-two" d="M33 15L15 33" />
    </svg>
  );
}

function ProjectFooter() {
  return (
    <footer className="project-footer">
      <div className="footer-inner">
        <section className="footer-brand">
          <Brand />

          <p>
            Focused task management
            <br />
            without the noise.
          </p>
        </section>

        <section className="footer-evolution">
          <p className="footer-heading">Project evolution</p>

          <p>
            Original MERN project, restored, secured and comprehensively
            modernised.
          </p>

          <span>
            From legacy learning codebase to a modern full-stack application.
          </span>
        </section>

        <section className="footer-studio">
          <strong>Created by Chameleon Unicode Studios</strong>

          <span>Cape Town, South Africa · 2026</span>

          <p>
            Legacy recovery · Security hardening
            <br />
            Full-stack modernisation
          </p>
        </section>

        <section className="footer-tech" aria-labelledby="tech-stack-heading">
          <div className="footer-tech-heading">
            <p id="tech-stack-heading">Tech stack</p>
            <span>Modern full-stack rebuild</span>
          </div>

          <div className="footer-tech-groups">
            <div className="tech-group">
              <span className="tech-group-label">Frontend</span>

              <div className="footer-stack frontend-stack">
                <span>React 19</span>
                <span>Vite 8</span>
                <span>Redux Toolkit</span>
              </div>
            </div>

            <div className="tech-group">
              <span className="tech-group-label">Backend</span>

              <div className="footer-stack backend-stack">
                <span>Node.js</span>
                <span>Express</span>
                <span>MongoDB</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}

function App() {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const tasks = useSelector((state) => state.tasks);

  const [mode, setMode] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [taskName, setTaskName] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (auth.token && !auth.isAuthenticated) {
      dispatch(loadUser());
    }
  }, [auth.token, auth.isAuthenticated, dispatch]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(fetchTasks());
    } else {
      dispatch(clearTasks());
    }
  }, [auth.isAuthenticated, dispatch]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const changeMode = (nextMode) => {
    dispatch(clearAuthError());
    setMode(nextMode);
    setMobileMenuOpen(false);
  };

  const handleAuthSubmit = (event) => {
    event.preventDefault();

    if (mode === 'register') {
      dispatch(registerUser(form));
      return;
    }

    dispatch(
      loginUser({
        email: form.email,
        password: form.password,
      })
    );
  };

  const handleTaskSubmit = (event) => {
    event.preventDefault();

    const value = taskName.trim();

    if (!value) return;

    dispatch(createTask(value));
    setTaskName('');
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearTasks());

    setMode('login');
    setMobileMenuOpen(false);
  };

  return (
    <div className="app">
      <div className="ambient ambient-right" aria-hidden="true" />
      <div className="ambient ambient-left" aria-hidden="true" />

      <header className="topbar">
        <div className="topbar-inner">
          <Brand />

          <div className="desktop-header-state">
            {auth.isAuthenticated ? (
              <>
                <div className="desktop-account">
                  <span className="avatar">
                    {auth.user?.name?.slice(0, 2).toUpperCase() || 'CL'}
                  </span>

                  <div>
                    <strong>{auth.user?.name || 'Account'}</strong>
                    <span>{auth.user?.email}</span>
                  </div>
                </div>

                <button
                  className="quiet-button"
                  type="button"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </>
            ) : (
              <span className="private-label">
                Private workspace
              </span>
            )}
          </div>

          <button
            className="mobile-menu-trigger"
            type="button"
            aria-label={
              mobileMenuOpen ? 'Close account menu' : 'Open account menu'
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            <MenuGlyph open={mobileMenuOpen} />
          </button>
        </div>

      </header>

        {mobileMenuOpen ? (
          <nav
            className="mobile-menu"
            aria-label="Account navigation"
          >
            <div className="mobile-menu-inner">
              <div className="mobile-menu-title">
                <span>Menu</span>

                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ×
                </button>
              </div>

              {auth.isAuthenticated ? (
                <>
                  <div className="mobile-profile">
                    <span className="mobile-avatar">
                      {auth.user?.name?.slice(0, 2).toUpperCase() || 'CL'}
                    </span>

                    <div>
                      <strong>{auth.user?.name || 'Account'}</strong>
                      <span>{auth.user?.email}</span>
                    </div>
                  </div>

                  <button
                    className="mobile-menu-action"
                    type="button"
                    onClick={handleLogout}
                  >
                    <span className="menu-action-icon">↪</span>

                    <span>
                      <strong>Sign out</strong>
                      <small>End your session securely</small>
                    </span>

                    <span aria-hidden="true">›</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="mobile-menu-action"
                    type="button"
                    onClick={() => changeMode('login')}
                  >
                    <span className="menu-action-icon">○</span>

                    <span>
                      <strong>Log in</strong>
                      <small>Access your workspace</small>
                    </span>

                    <span aria-hidden="true">›</span>
                  </button>

                  <button
                    className="mobile-menu-action"
                    type="button"
                    onClick={() => changeMode('register')}
                  >
                    <span className="menu-action-icon">＋</span>

                    <span>
                      <strong>Create account</strong>
                      <small>Create your private workspace</small>
                    </span>

                    <span aria-hidden="true">›</span>
                  </button>
                </>
              )}

              <div className="mobile-menu-brand">
                <ClearlistLogo />
                <span>Clearlist</span>
                <small>02</small>
              </div>
            </div>
          </nav>
        ) : null}

      <main className="workspace">
        <section className="workspace-header">
          <div>
            <p className="workspace-kicker">
              Personal workspace
            </p>

            <h1>Today</h1>

            <p className="workspace-intro">
              A quieter place for the work that matters next.
            </p>
          </div>

          {auth.isAuthenticated ? (
            <div className="task-counter">
              <strong>{String(tasks.items.length).padStart(2, '0')}</strong>

              <span>
                {tasks.items.length === 1 ? 'active task' : 'active tasks'}
              </span>
            </div>
          ) : null}
        </section>

        {auth.isAuthenticated ? (
          <section className="signed-in-workspace">
            <form
              className="task-entry"
              onSubmit={handleTaskSubmit}
              aria-label="Add task"
            >
              <span className="task-entry-icon" aria-hidden="true">
                +
              </span>

              <label className="sr-only" htmlFor="new-task">
                New task
              </label>

              <input
                id="new-task"
                value={taskName}
                onChange={(event) => setTaskName(event.target.value)}
                placeholder="Add one clear next action…"
                autoComplete="off"
              />

              <button
                className="primary-button"
                type="submit"
                disabled={!taskName.trim()}
              >
                Add task
                <span aria-hidden="true">→</span>
              </button>
            </form>

            {tasks.error ? (
              <p className="status-error" role="alert">
                {tasks.error}
              </p>
            ) : null}

            <section className="task-list" aria-labelledby="tasks-heading">
              <div className="section-heading">
                <div>
                  <p>YOUR FOCUS</p>
                  <h2 id="tasks-heading">Current list</h2>
                </div>

                <span>Newest first</span>
              </div>

              {tasks.loading ? (
                <p className="empty-copy" role="status">
                  Loading your workspace…
                </p>
              ) : tasks.items.length ? (
                <ul>
                  {tasks.items.map((task, index) => (
                    <li key={task._id}>
                      <span className="task-index" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span className="task-node" aria-hidden="true" />

                      <span className="task-title">
                        {task.name}
                      </span>

                      <button
                        className="delete-button"
                        type="button"
                        aria-label={`Delete task ${task.name}`}
                        onClick={() => dispatch(removeTask(task._id))}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state">
                  <ClearlistLogo className="empty-logo" />

                  <p>NOTHING PENDING</p>

                  <h2>Your list is clear.</h2>

                  <span>
                    Add one useful task when you are ready.
                  </span>
                </div>
              )}
            </section>
          </section>
        ) : (
          <section className="auth-layout" aria-labelledby="auth-heading">
            <div className="auth-story">
              <p className="story-number">
                01 / PRIVATE WORKSPACE
              </p>

              <h2
                id="auth-heading"
                aria-label="Your tasks stay with your account."
              >
                Your tasks stay
                <br />
                with your
                <br />
                account.
              </h2>

              <p className="auth-lead">
                One focused list. Your work, your session, your space.
              </p>

              <div className="story-details">
                <div>
                  <span>01</span>
                  <p>Account-owned task data</p>
                </div>

                <div>
                  <span>02</span>
                  <p>Focused daily workflow</p>
                </div>

                <div>
                  <span>03</span>
                  <p>Simple by design</p>
                </div>
              </div>
            </div>

            <div className={`auth-card auth-card-${mode}`}>
              <div className="auth-card-heading">
                <ClearlistLogo className="auth-logo" />

                <div>
                  <strong>
                    {mode === 'register'
                      ? 'Create your workspace'
                      : 'Welcome back'}
                  </strong>

                  <span>
                    {mode === 'register'
                      ? 'Start with one private list.'
                      : 'Continue to your private workspace.'}
                  </span>
                </div>
              </div>

              <form
                className="auth-form"
                onSubmit={handleAuthSubmit}
              >
                <div className="auth-mode-marker">
                  <span>
                    {mode === 'register' ? '02' : '01'}
                  </span>

                  <p>
                    {mode === 'register'
                      ? 'NEW WORKSPACE'
                      : 'RETURNING USER'}
                  </p>
                </div>

                <div className="auth-fields">
                  {mode === 'register' ? (
                    <label className="auth-slot">
                      <span>Name</span>

                      <input
                        required
                        name="name"
                        autoComplete="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            name: event.target.value,
                          })
                        }
                      />
                    </label>
                  ) : (
                    <div className="auth-slot login-security-slot">
                      <span className="security-icon" aria-hidden="true">
                        ✓
                      </span>

                      <div>
                        <strong>Private by design</strong>
                        <span>
                          Your tasks are isolated to your authenticated account.
                        </span>
                      </div>
                    </div>
                  )}

                  <label>
                    <span>Email</span>

                    <input
                      required
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          email: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    <span>Password</span>

                    <input
                      required
                      type="password"
                      name="password"
                      autoComplete={
                        mode === 'register'
                          ? 'new-password'
                          : 'current-password'
                      }
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          password: event.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                {auth.error ? (
                  <p className="status-error" role="alert">
                    {auth.error}
                  </p>
                ) : null}

                <button
                  className="primary-button auth-submit"
                  disabled={auth.loading}
                >
                  <span>
                    {auth.loading
                      ? 'Working…'
                      : mode === 'register'
                        ? 'Create account'
                        : 'Enter Clearlist'}
                  </span>

                  <span aria-hidden="true">→</span>
                </button>
              </form>

              <div className="auth-mode-switch">
                <span>
                  {mode === 'register'
                    ? 'Already have an account?'
                    : 'New to Clearlist?'}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    changeMode(
                      mode === 'register'
                        ? 'login'
                        : 'register'
                    )
                  }
                >
                  {mode === 'register'
                    ? 'Log in'
                    : 'Create account'}
                  <span aria-hidden="true">↗</span>
                </button>
              </div>

              <p className="auth-footnote">
                Private by account. Built around one clear next action.
              </p>
            </div>
          </section>
        )}
      </main>

      <ProjectFooter />
    </div>
  );
}

export default App;
