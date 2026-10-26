import React from 'react';
import { GraduationCap, Heart, MessageCircle, Search, Ticket, Wallet } from 'lucide-react';
import { useApp } from '../context';
import { Button } from '../ui';

export function Homepage() {
  return (
    <section className="overflow-hidden rounded-3xl bg-white">
      <Hero />
      <Capabilities />
      <DestinationExplorer />
      <Trust />
    </section>
  );
}

function Hero() {
  const { navigate } = useApp();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
        Your future starts with the right university.
      </h1>
      <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
        Find universities that fit your ambitions, qualifications, and budget. Understand your options, explore scholarships, and plan your next step.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" className="px-6 py-3" onClick={() => navigate('onboarding')}>
          Find My Universities
        </Button>
        <Button variant="outline" className="px-6 py-3" onClick={() => navigate('scholarships')}>
          Explore Scholarships
        </Button>
      </div>
    </div>
  );
}

function Capabilities() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">What we help you with</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Capability icon={<Search className="h-6 w-6 text-primary" />} title="Find your best-fit universities" text="Search and filter universities and programs that match your qualifications and preferences." />
        <Capability icon={<GraduationCap className="h-6 w-6 text-primary" />} title="Understand your eligibility" text="Assess your admission chances based on your qualifications, grades, and subject requirements." />
        <Capability icon={<Wallet className="h-6 w-6 text-primary" />} title="Know the real cost of your degree" text="Calculate annual and full-degree costs with transparent breakdowns and currency conversion." />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Capability icon={<Ticket className="h-6 w-6 text-primary" />} title="Discover scholarships" text="Find merit-based and need-based scholarships from Pakistani and international sources." />
        <Capability icon={<MessageCircle className="h-6 w-6 text-primary" />} title="Plan your applications" text="Track deadlines, required documents, and application tasks in one place." />
        <Capability icon={<Heart className="h-6 w-6 text-primary" />} title="AI Counselor" text="Get grounded advice about universities, scholarships, and admission requirements." />
      </div>
    </div>
  );
}

function Capability({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">{icon}</div>
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}

function DestinationExplorer() {
  const { navigate } = useApp();
  const destinations = ['Pakistan', 'Saudi Arabia', 'Italy', 'Germany', 'United Kingdom', 'United States', 'Canada'];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">Destination filters</h2>
      <p className="mb-6 text-muted-foreground">Filter by location to see universities in your preferred country.</p>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
        {destinations.map((destination) => (
          <button
            key={destination}
            type="button"
            className="rounded-full border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
            onClick={() => navigate('universities', { country: destination })}
          >
            {destination}
          </button>
        ))}
      </div>
    </div>
  );
}

function Trust() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">How recommendations work</h2>
      <p className="mb-6 text-muted-foreground">
        We partner with official university sources and government databases to provide reliable information. Scholarship and cost data is verified against published institutional records. All estimates are clearly marked, and we distinguish between official requirements and third-party calculations.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <h3 className="mb-2 font-medium">Official source checked</h3>
          <p className="text-sm text-muted-foreground">University program data verified against official admissions pages.</p>
        </div>
        <div>
          <h3 className="mb-2 font-medium">Transparent estimates</h3>
          <p className="text-sm text-muted-foreground">Cost calculations and scholarship matches are clearly labeled by source type.</p>
        </div>
        <div>
          <h3 className="mb-2 font-medium">Source verification</h3>
          <p className="text-sm text-muted-foreground">Every record includes source URLs and last-verified dates.</p>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
