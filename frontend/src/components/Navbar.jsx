import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSavedResources } from '../hooks/useSavedResources';

const links = [
  { to: '/', label: 'Home' },
  { to: '/resources', label: 'Resources' },
  { to: '/saved', label: 'Saved Resources' },
  { to: '/recommendations', label: 'Recommendations' },
  { to: '/about', label: 'About' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const { savedCount } = useSavedResources();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            EL
          </span>
          <span>
            <strong>EduLanka</strong>
            <small>Learn from one place</small>
          </span>
        </NavLink>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <nav id="site-nav" className={open ? 'site-nav is-open' : 'site-nav'}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
              onClick={() => setOpen(false)}
            >
              {link.label}
              {link.to === '/saved' && savedCount > 0 ? (
                <span className="nav-count">{savedCount}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
