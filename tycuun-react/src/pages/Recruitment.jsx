import { Users } from 'lucide-react';

export default function Recruitment() {
  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-12 md:pb-20 px-4 bg-bg">
      <div className="max-w-lg mx-auto text-center">
        <div className="bg-card border border-border rounded-2xl p-10 shadow-lg shadow-black/5">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
            <Users className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-main font-display mb-2">Recruitment</h1>
          <p className="text-muted text-sm">This page is coming soon. Stay tuned!</p>
        </div>
      </div>
    </div>
  );
}
