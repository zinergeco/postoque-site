const path = require('path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

const SESSION_SECRET = process.env.SESSION_SECRET || 'postoque-dev-secret-change-me';
const DEMO_USER_EMAIL = (process.env.DEMO_USER_EMAIL || 'zinergeco@gmail.com').toLowerCase();
const DEMO_USER_PASSWORD_HASH = process.env.DEMO_USER_PASSWORD_HASH || '';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    name: 'postoque.sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    },
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.year = new Date().getFullYear();
  next();
});

function requireAuth(req, res, next) {
  if (req.session.user) return next();
  return res.redirect('/login');
}

const MODULES = [
  { key: 'HubQue', desc: 'Your command centre — a single overview of every brand, channel and queue.' },
  { key: 'BrandQue', desc: 'Manage brands, clients and workspaces from one place.' },
  { key: 'ConnectQue', desc: 'Connect and authorise your social, email and website accounts.' },
  { key: 'PlanQue', desc: 'Plan campaigns and content across a shared editorial calendar.' },
  { key: 'ContentQue', desc: 'Draft and generate on-brand content, ready for review.' },
  { key: 'MediaQue', desc: 'A shared library for every image, video and brand asset.' },
  { key: 'ApprovalQue', desc: 'Route drafts through approval before anything goes out.' },
  { key: 'SocialQue', desc: 'Schedule and publish across every connected social network.' },
  { key: 'PublishQue', desc: 'One queue for every outbound post, email and blog article.' },
  { key: 'EmailQue', desc: 'Build and automate email marketing campaigns.' },
  { key: 'InsightQue', desc: 'Performance analytics and reporting across every channel.' },
  { key: 'AutoQue', desc: 'Automation rules that keep the queue moving on its own.' },
  { key: 'DevQue', desc: 'API access and developer tooling for custom integrations.' },
  { key: 'AdminQue', desc: 'Users, roles, permissions and billing in one control panel.' },
  { key: 'BlogQue', desc: 'Draft, review and publish articles straight to your website.' },
];

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('login', { error: req.query.error === '1' });
});

app.post('/login', (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  const validEmail = email && email === DEMO_USER_EMAIL;
  const validPassword =
    validEmail && DEMO_USER_PASSWORD_HASH && bcrypt.compareSync(password, DEMO_USER_PASSWORD_HASH);

  if (!validEmail || !validPassword) {
    return res.redirect('/login?error=1');
  }

  req.session.user = { email: DEMO_USER_EMAIL };
  res.redirect('/dashboard');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', { modules: MODULES });
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`PostoQue site listening on port ${PORT}`);
  if (!DEMO_USER_PASSWORD_HASH) {
    console.warn('WARNING: DEMO_USER_PASSWORD_HASH is not set — demo login will always fail.');
  }
});
