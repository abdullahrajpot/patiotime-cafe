const SOCIAL = [
  { label: 'Facebook', icon: 'f', href: '#' },
  { label: 'X', icon: '𝕏', href: '#' },
  { label: 'Instagram', icon: '◎', href: '#' },
  { label: 'Pinterest', icon: 'P', href: '#' },
  { label: 'YouTube', icon: '▶', href: '#' },
];

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <div className="topbar-left">
          <span className="topbar-item">Silk St, Barbican, London EC2Y 8DS, UK</span>
          <span className="topbar-item">booking@patiotime.com</span>
        </div>
        <div className="topbar-right">
          <span className="topbar-item">+39-055-123456</span>
          <div className="topbar-socials">
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}>{s.icon}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
