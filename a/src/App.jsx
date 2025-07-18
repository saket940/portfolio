import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import profileImg from './assets/IMG-20250718-WA0000 (3).jpg'; // Replace with your actual photo filename

function Home() {
  return (
    <section className="section home-section flex flex-col items-center" data-aos="fade-up">
      <img
        src={profileImg}
        alt="Profile"
        className="w-32 h-32 rounded-full shadow-lg mb-4 object-cover border-4 border-indigo-400"
        style={{ background: '#e0e7ff' }}
      />
        <h1>Hi, I'm Saket Raja dadarya</h1>
        <p>Fullstack Developer</p>
        <p>Welcome to my portfolio website!</p>
      </section>
  );
}

function About() {
  return (
    <section className="section about-section" data-aos="fade-right">
        <h2>About Me</h2>
        <p>I'm a passionate fullstack developer skilled in building modern web applications from scratch. I love working with both frontend and backend technologies to deliver complete solutions.</p>
        <ul>
          <li><strong>Frontend:</strong> React, HTML, CSS, JavaScript</li>
          <li><strong>Backend:</strong> Node.js, Express</li>
          <li><strong>Tools:</strong> Git, REST APIs, MongoDB</li>
        </ul>
      </section>
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://portfoliobackend-i9jb.onrender.com/project')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <section className="section projects-section" data-aos="fade-left">
        <h2>Projects</h2>
      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">{error}</p>}
        <div className="project-list">
        {projects.map((project, idx) => (
          <div className="project-item" key={idx}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer">View Project</a>
            )}
          </div>
        ))}
        </div>
      </section>
  );
}

function Contact() {
  return (
    <section className="section contact-section" data-aos="fade-up">
        <h2>Contact</h2>
        <p>Feel free to reach out for collaboration or just a friendly hello!</p>
        <ul>
          <li>Email: <a href="mailto:asdadarya2222@gmail.com">asdadarya2222@gmail.com</a></li>
          <li>LinkedIn: <a href="https://www.linkedin.com/in/saket-dadarya
                          " target="_blank" rel="noopener noreferrer">saket-dadarya</a></li>
          <li>GitHub: <a href="https://github.com/saket940" target="_blank" rel="noopener noreferrer">https://github.com/saket940</a></li>
        </ul>
      </section>
  );
}

function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', link: '' });
  const [editId, setEditId] = useState(null);

  // Fetch projects
  const fetchProjects = () => {
    setLoading(true);
    fetch('https://portfoliobackend-i9jb.onrender.com/project')
      .then(res => res.json())
      .then(data => { setProjects(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(err => { setError('Failed to fetch projects'); setLoading(false); });
  };

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    fetch('https://portfoliobackend-i9jb.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok && data.success) {
          localStorage.setItem('token', data.token);
          setLoggedIn(true);
          fetchProjects();
        } else {
          setLoginError(data.message || 'Login failed');
        }
      })
      .catch(() => setLoginError('Login failed'));
  };

  // Add or update project
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `https://portfoliobackend-i9jb.onrender.com/project/${editId}` : 'https://portfoliobackend-i9jb.onrender.com/project';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', authorization: localStorage.getItem('token') },
      body: JSON.stringify(form)
      
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setForm({ title: '', description: '', link: '' });
          setEditId(null);
          fetchProjects();
        } else {
          setError(data.error || 'Failed to save project');
        }
      })
      .catch(() => setError('Failed to save project'));
  };

  // Edit project
  const handleEdit = (project) => {
    setForm({ title: project.title, description: project.description, link: project.link });
    setEditId(project._id);
  };

  // Delete project
  const handleDelete = (id) => {
    if (!window.confirm('Delete this project?')) return;
    fetch(`https://portfoliobackend-i9jb.onrender.com/project/${id}`, { method: 'DELETE', headers: { authorization: localStorage.getItem('token') } })
      .then(res => res.json())
      .then(() => fetchProjects())
      .catch(() => setError('Failed to delete project'));
  };

  if (!loggedIn) {
    return (
      <section className="section max-w-md mx-auto mt-8">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input className="p-2 rounded border" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="p-2 rounded border" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="bg-indigo-600 text-white rounded px-4 py-2 font-bold hover:bg-indigo-800" type="submit">Login</button>
          {loginError && <p className="text-red-500">{loginError}</p>}
        </form>
      </section>
    );
  }

  return (
    <section className="section max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Project Admin Panel</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
        <input className="p-2 rounded border" placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <input className="p-2 rounded border" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        <input className="p-2 rounded border" placeholder="Link" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
        <button className="bg-green-600 text-white rounded px-4 py-2 font-bold hover:bg-green-800" type="submit">{editId ? 'Update' : 'Add'} Project</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <div>
        {loading ? <p>Loading...</p> : (
          Array.isArray(projects) && (
            <ul className="space-y-4">
              {projects.map(project => (
                <li key={project._id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white dark:bg-gray-800">
                  <div>
                    <h3 className="font-bold text-lg">{project.title}</h3>
                    <p>{project.description}</p>
                    {project.link && <a href={project.link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">View</a>}
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700" onClick={() => handleEdit(project)}>Edit</button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800" onClick={() => handleDelete(project._id)}>Delete</button>
    </div>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </section>
  );
}

function GitHubRepos({ username = "saket940" }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  console.log("ddfgdfdg")
    fetch(`https://api.github.com/users/${username}/repos`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch GitHub repos');
        return res.json();
      })
      .then((data) => {
      console.log(data)
        setRepos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [username]);

  return (
    <section className="section github-section" data-aos="zoom-in-up">
      <h2>GitHub Repositories</h2>
      {loading && <p>Loading repositories...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="project-list">
        {repos.map((repo) => (
          <div className="project-item" key={repo.id}>
            <h3>{repo.name}</h3>
            <p>{repo.description || 'No description'}</p>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">View on GitHub</a>
          </div>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="portfolio-container min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
        <nav className={
          `flex gap-4 mb-8 p-4 rounded-lg shadow items-center ` +
          (darkMode ? 'dark-bg-gray90080' : 'bg-white80')
        }>
          <Link to="/" className="font-semibold hover:underline">Home</Link>
          <Link to="/about" className="font-semibold hover:underline">About Me</Link>
          
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="ml-auto px-4 py-2 rounded bg-indigo-500 text-white dark:bg-gray-700 dark:text-yellow-300 font-bold shadow hover:bg-indigo-700 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>
        <Routes>
          <Route path="/" element={<><Home /><Projects /><GitHubRepos username="saket940" /><Contact /></>} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
