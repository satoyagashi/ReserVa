import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Header from './Header'

const parkingLots = [
  { name: 'North Garage', area: 'North Campus', distance: '3 min walk', available: 42, total: 180, rate: '$2.00 / hour', tag: 'Covered' },
  { name: 'Library Lot', area: 'Central Campus', distance: '2 min walk', available: 18, total: 75, rate: '$1.50 / hour', tag: 'Visitor friendly' },
  { name: 'East Student Lot', area: 'East Campus', distance: '6 min walk', available: 67, total: 240, rate: '$1.00 / hour', tag: 'Student parking' },
  { name: 'Innovation Center', area: 'Central Campus', distance: '5 min walk', available: 9, total: 60, rate: '$2.50 / hour', tag: 'EV charging' },
]

const parkingHistory = [
  { date: 'Oct 18, 2026', time: '9:14 AM – 1:42 PM', location: 'North Garage', space: 'Level 2 · B-24', duration: '4h 28m', amount: '$8.00', status: 'Completed' },
  { date: 'Oct 16, 2026', time: '10:02 AM – 12:35 PM', location: 'Library Lot', space: 'Row C · 18', duration: '2h 33m', amount: '$4.00', status: 'Completed' },
  { date: 'Oct 14, 2026', time: '8:47 AM – 3:10 PM', location: 'East Student Lot', space: 'Row A · 07', duration: '6h 23m', amount: '$6.00', status: 'Completed' },
  { date: 'Oct 12, 2026', time: '11:20 AM – 1:05 PM', location: 'North Garage', space: 'Level 1 · A-16', duration: '1h 45m', amount: '$4.00', status: 'Completed' },
]

const today = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format(new Date())

function getPageFromHash() {
  const page = window.location.hash.slice(1)
  return ['overview', 'parking-history', 'find-parking'].includes(page) ? page : 'overview'
}

function OverviewPage() {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{today}</p>
          <h1>Good morning, Campus User</h1>
          <p className="heading-description">Here’s what’s happening with parking on campus today.</p>
        </div>
        <a className="button button-primary" href="#find-parking">Find a parking spot</a>
      </div>

      <section className="metric-grid" aria-label="Parking overview">
        <article className="metric-card">
          <span className="metric-icon blue-icon" aria-hidden="true">P</span>
          <div><p className="metric-label">Available spaces</p><p className="metric-value">136 <span>of 555</span></p></div>
          <span className="metric-note positive-note">Across campus</span>
        </article>
        <article className="metric-card">
          <span className="metric-icon green-icon" aria-hidden="true">✓</span>
          <div><p className="metric-label">Your parking this month</p><p className="metric-value">18 <span>hours</span></p></div>
          <span className="metric-note">4 visits</span>
        </article>
        <article className="metric-card">
          <span className="metric-icon amber-icon" aria-hidden="true">$</span>
          <div><p className="metric-label">Parking spend</p><p className="metric-value">$22.00</p></div>
          <span className="metric-note">This month</span>
        </article>
      </section>

      <div className="overview-grid">
        <section className="surface-card active-session" aria-labelledby="session-heading">
          <div className="section-heading">
            <div><p className="eyebrow">YOUR VEHICLE</p><h2 id="session-heading">No active parking session</h2></div>
            <span className="status-pill status-neutral">Not parked</span>
          </div>
          <p className="muted-copy">Find a space nearby and start your day. You can view live availability across campus.</p>
          <a className="text-link" href="#find-parking">Browse available parking <span aria-hidden="true">→</span></a>
        </section>

        <section className="surface-card" aria-labelledby="popular-heading">
          <div className="section-heading">
            <div><p className="eyebrow">LIVE AVAILABILITY</p><h2 id="popular-heading">Popular nearby lots</h2></div>
            <a className="text-link compact-link" href="#find-parking">View all</a>
          </div>
          <div className="mini-lot-list">
            {parkingLots.slice(0, 3).map((lot) => (
              <div className="mini-lot" key={lot.name}>
                <span className="lot-pin" aria-hidden="true">P</span>
                <span className="mini-lot-name"><strong>{lot.name}</strong><span>{lot.distance}</span></span>
                <span className="mini-lot-spaces"><strong>{lot.available}</strong><span>spaces</span></span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="surface-card recent-activity" aria-labelledby="activity-heading">
        <div className="section-heading">
          <div><p className="eyebrow">YOUR ACTIVITY</p><h2 id="activity-heading">Recent parking</h2></div>
          <a className="text-link compact-link" href="#parking-history">Full history</a>
        </div>
        <div className="activity-row">
          <span className="activity-date">OCT <strong>18</strong></span>
          <span className="activity-location"><strong>North Garage</strong><span>Level 2 · B-24 · 9:14 AM – 1:42 PM</span></span>
          <span className="activity-amount">$8.00</span>
          <span className="status-pill status-success">Completed</span>
        </div>
        <div className="activity-row">
          <span className="activity-date">OCT <strong>16</strong></span>
          <span className="activity-location"><strong>Library Lot</strong><span>Row C · 18 · 10:02 AM – 12:35 PM</span></span>
          <span className="activity-amount">$4.00</span>
          <span className="status-pill status-success">Completed</span>
        </div>
      </section>
    </>
  )
}

function HistoryPage() {
  const [search, setSearch] = useState('')
  const filteredHistory = useMemo(
    () => parkingHistory.filter((item) => `${item.location} ${item.space} ${item.date}`.toLowerCase().includes(search.toLowerCase())),
    [search],
  )

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR ACCOUNT</p>
          <h1>Parking history</h1>
          <p className="heading-description">Review your past campus parking visits and charges.</p>
        </div>
        <a className="button button-secondary" href="#find-parking">Find parking</a>
      </div>
      <section className="metric-grid history-metrics" aria-label="Parking history summary">
        <article className="metric-card"><div><p className="metric-label">Total visits</p><p className="metric-value">4 <span>this month</span></p></div></article>
        <article className="metric-card"><div><p className="metric-label">Total time parked</p><p className="metric-value">15h 9m</p></div></article>
        <article className="metric-card"><div><p className="metric-label">Total spent</p><p className="metric-value">$22.00</p></div></article>
      </section>
      <section className="surface-card history-card" aria-labelledby="history-heading">
        <div className="section-heading history-card-heading">
          <div><p className="eyebrow">OCTOBER 2026</p><h2 id="history-heading">Your parking sessions</h2></div>
          <label className="search-box history-search">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input aria-label="Search parking history" placeholder="Search locations" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
        </div>
        <div className="table-scroll">
          <table className="history-table">
            <thead><tr><th>Date &amp; time</th><th>Location</th><th>Duration</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={`${item.date}-${item.location}`}>
                  <td><strong>{item.date}</strong><span>{item.time}</span></td>
                  <td><strong>{item.location}</strong><span>{item.space}</span></td>
                  <td>{item.duration}</td>
                  <td className="table-amount">{item.amount}</td>
                  <td><span className="status-pill status-success">{item.status}</span></td>
                </tr>
              ))}
              {filteredHistory.length === 0 && <tr><td className="empty-state" colSpan="5">No parking sessions match “{search}”.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="table-footnote">Showing {filteredHistory.length} of {parkingHistory.length} sessions</p>
      </section>
    </>
  )
}

function FindParkingPage() {
  const [search, setSearch] = useState('')
  const [area, setArea] = useState('All areas')
  const filteredLots = parkingLots.filter((lot) => {
    const matchesSearch = `${lot.name} ${lot.area} ${lot.tag}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (area === 'All areas' || lot.area === area)
  })

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CAMPUS PARKING</p>
          <h1>Find parking</h1>
          <p className="heading-description">Explore live parking availability and choose a convenient lot.</p>
        </div>
        <span className="live-indicator"><span aria-hidden="true"></span> Live availability</span>
      </div>
      <section className="find-intro">
        <div className="find-intro-copy"><span className="find-intro-icon" aria-hidden="true">P</span><div><h2>Where would you like to park?</h2><p>There are <strong>136 open spaces</strong> across campus right now.</p></div></div>
        <div className="finder-controls">
          <label className="search-box">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input aria-label="Search parking lots" placeholder="Search lots or buildings" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <label className="select-box"><span className="visually-hidden">Filter by campus area</span>
            <select value={area} onChange={(event) => setArea(event.target.value)}>
              <option>All areas</option><option>North Campus</option><option>Central Campus</option><option>East Campus</option>
            </select>
          </label>
        </div>
      </section>
      <div className="lot-results-heading"><h2>Parking locations</h2><span>{filteredLots.length} locations</span></div>
      <section className="lot-grid" aria-label="Available parking locations">
        {filteredLots.map((lot) => {
          const availability = Math.round((lot.available / lot.total) * 100)
          return (
            <article className="lot-card" key={lot.name}>
              <div className="lot-card-top"><span className="lot-pin large-pin" aria-hidden="true">P</span><span className="availability-label"><span className="availability-dot" aria-hidden="true"></span> Open now</span></div>
              <h3>{lot.name}</h3>
              <p className="lot-area">{lot.area} <span aria-hidden="true">·</span> {lot.distance}</p>
              <div className="lot-capacity"><div><strong>{lot.available}</strong><span> spaces available</span></div><span>{lot.total} total</span></div>
              <div className="capacity-track" role="img" aria-label={`${availability}% of spaces available`}><span style={{ width: `${availability}%` }} /></div>
              <div className="lot-card-details"><span className="lot-tag">{lot.tag}</span><strong>{lot.rate}</strong></div>
            </article>
          )
        })}
        {filteredLots.length === 0 && <div className="surface-card no-lots">No parking locations match your search. Try a different lot name or campus area.</div>}
      </section>
      <p className="availability-disclaimer">Availability is updated periodically and may change as vehicles enter and leave campus.</p>
    </>
  )
}

function App() {
  const [activePage, setActivePage] = useState(getPageFromHash)

  useEffect(() => {
    const updatePage = () => setActivePage(getPageFromHash())
    window.addEventListener('hashchange', updatePage)
    return () => window.removeEventListener('hashchange', updatePage)
  }, [])

  const pageTitles = {
    overview: 'Overview',
    'parking-history': 'Parking History',
    'find-parking': 'Find Parking',
  }

  return (
    <div className="app-layout">
      <Header activePage={activePage} />
      <main className="page-content" id={activePage} aria-label={pageTitles[activePage]}>
        {activePage === 'parking-history' ? <HistoryPage /> : activePage === 'find-parking' ? <FindParkingPage /> : <OverviewPage />}
        <footer className="page-footer">Campus Parking <span>·</span> Parking information for your campus</footer>
      </main>
    </div>
  )
}

export default App
