export default function Footer() {
  return (
    <footer className="relative border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-accent/20 rounded-lg rotate-45"></div>
                <div className="absolute inset-1 rounded-md rotate-45" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}></div>
              </div>
              <span className="font-display font-bold text-xl text-main">TYCUUN</span>
            </a>
            <p className="text-muted max-w-sm mb-6">The business social network designed to support entrepreneurs.</p>
          </div>
          <div>
            <h4 className="font-semibold text-main mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-muted hover:text-accent transition-colors">Features</a></li>
              <li><a href="#about" className="text-muted hover:text-accent transition-colors">About</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-main mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted hover:text-accent transition-colors">Privacy</a></li>
              <li><a href="#" className="text-muted hover:text-accent transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm">2026 TYCUUN. All rights reserved.</p>
          <p className="text-muted text-sm">Built for entrepreneurs.</p>
        </div>
      </div>
    </footer>
  );
}
