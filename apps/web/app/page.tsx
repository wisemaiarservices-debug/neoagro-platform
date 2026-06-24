export default function HomePage() {
  return (
    <main className="container">
      <nav className="nav">
        <div className="logo">NOVA AGRICULTURE</div>
        <a href="/dashboard" className="badge">Open dashboard</a>
      </nav>
      <section>
        <div className="kicker">NeoHaven AI Urban Labs</div>
        <h1>NeoAgro turns agrivoltaic sites into intelligent infrastructure.</h1>
        <p>
          NeoAgro is the NOVA Agriculture module for crop health, water optimization,
          weather risk, solar coordination, and operator-approved AI recommendations.
        </p>
        <a className="cta" href="/dashboard">View SolarHub demo dashboard</a>
      </section>
      <section className="grid grid-3" style={{ marginTop: 40 }}>
        <div className="card"><h2>Observe</h2><p>Unify field, weather, water, satellite, solar, and sensor data.</p></div>
        <div className="card"><h2>Forecast</h2><p>Predict water demand, yield risk, heat stress, and energy impact.</p></div>
        <div className="card"><h2>Recommend</h2><p>Generate actions for operator approval with clear impact scoring.</p></div>
      </section>
    </main>
  );
}
