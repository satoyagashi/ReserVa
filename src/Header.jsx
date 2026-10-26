import './Header.css'

const navigationItems = [
  {
    label: 'Overview',
    href: '#overview',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: 'Parking History',
    href: '#parking-history',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 8v4l2.5 1.5" />
        <circle cx="12" cy="12" r="8.5" />
        <path d="M5.5 4.5 4 6m14.5-1.5L20 6" />
      </svg>
    ),
  },
  {
    label: 'Find Parking',
    href: '#find-parking',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
]

function Header({ activePage }) {
  return (
    <aside className="sidebar">
      <a className="sidebar-brand" href="#overview" aria-label="Campus Parking overview">
        <span className="brand-mark" aria-hidden="true">P</span>
        <span>Campus Parking</span>
      </a>

      <nav className="sidebar-navigation" aria-label="Main navigation">
        <p className="sidebar-label">MENU</p>
        {navigationItems.map(({ label, href, icon }) => {
          const isActive = href === `#${activePage}`

          return (
            <a
              className={`sidebar-link${isActive ? ' is-active' : ''}`}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              key={label}
            >
              <span className="sidebar-icon">{icon}</span>
              <span>{label}</span>
            </a>
          )
        })}
      </nav>

      <section className="sidebar-profile" aria-label="User profile">
        <span className="profile-avatar" aria-hidden="true">CU</span>
        <span className="profile-details">
          <span className="profile-name">Campus User</span>
          <span className="profile-role">Student account</span>
        </span>
        <span className="profile-menu" aria-hidden="true">···</span>
      </section>
    </aside>
  )
}

export default Header
