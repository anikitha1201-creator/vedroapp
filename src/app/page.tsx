
import { FlaskConical, Gamepad2, Puzzle, User, Bot } from 'lucide-react';
import Link from 'next/link';

const dashboardItems = [
   {
    title: 'Vedro AI Tutor',
    href: '/ai-chatbot',
    icon: <Bot />,
  },
  {
    title: 'Concept Builder',
    href: '/concept-builder',
    icon: <Puzzle />,
  },
  {
    title: 'Sandbox Experiment',
    href: '/sandbox-experiment',
    icon: <FlaskConical />,
  },
  {
    title: 'Running Quiz',
    href: '/running-quiz',
    icon: <Gamepad2 />,
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: <User />,
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8 h-full flex flex-col justify-center items-center">
      <h1 className="text-4xl font-display text-center mb-12 text-primary text-ink-fade">
        Table of Contents
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {dashboardItems.map((item, index) => (
          <Link
            href={item.href}
            key={item.href}
            className="opacity-0"
            style={{ animation: `ink-fade-in 1s ease-out ${0.5 + index * 0.1}s forwards` }}
          >
            <div className="group w-full p-4 rounded-md border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 wax-press flex items-center gap-4">
              <div className="text-accent">{item.icon}</div>
              <h2 className="font-display text-lg text-primary/90 group-hover:text-primary">
                {item.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
