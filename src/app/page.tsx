import DashboardCard from '@/components/dashboard-card';
import PageWrapper from '@/components/page-wrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bot, FlaskConical, Gamepad2, Puzzle, Settings, User } from 'lucide-react';

const dashboardItems = [
  {
    title: 'Vedro AI Chatbot',
    description: 'Solve doubts, get explanations, and generate notes with our AI tutor.',
    href: '/ai-chatbot',
    icon: <Bot />,
    image: PlaceHolderImages.find((img) => img.id === 'ai-chatbot'),
  },
  {
    title: 'Concept Builder',
    description: 'Drag and drop concepts to build your understanding.',
    href: '/concept-builder',
    icon: <Puzzle />,
    image: PlaceHolderImages.find((img) => img.id === 'concept-builder'),
  },
  {
    title: 'Sandbox Experiment',
    description: 'Mix, match, and experiment in a virtual lab.',
    href: '/sandbox-experiment',
    icon: <FlaskConical />,
    image: PlaceHolderImages.find((img) => img.id === 'sandbox-experiment'),
  },
  {
    title: 'Running Quiz Game',
    description: 'Test your knowledge in an infinite runner quiz.',
    href: '/running-quiz',
    icon: <Gamepad2 />,
    image: PlaceHolderImages.find((img) => img.id === 'running-quiz'),
  },
  {
    title: 'Profile',
    description: 'View your progress, scores, and badges.',
    href: '/profile',
    icon: <User />,
    image: PlaceHolderImages.find((img) => img.id === 'profile'),
  },
  {
    title: 'Settings',
    description: 'Manage your account and preferences.',
    href: '/settings',
    icon: <Settings />,
    image: PlaceHolderImages.find((img) => img.id === 'settings'),
  },
];

export default function DashboardPage() {
  return (
    <PageWrapper>
      <h1 className="text-4xl font-headline font-bold text-center mb-4 text-primary text-ink-fade">
        Dashboard
      </h1>
      <p className="text-center text-muted-foreground mb-12 animate-[ink-fade-in_1s_ease-out_0.5s_forwards] opacity-0">
        Welcome, scholar. Your journey of knowledge begins here.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dashboardItems.map((item, index) => (
          <div
            key={item.href}
            className="opacity-0"
            style={{ animation: `ink-fade-in 1s ease-out ${0.5 + index * 0.1}s forwards` }}
          >
            <DashboardCard
              title={item.title}
              description={item.description}
              href={item.href}
              icon={item.icon}
              imageUrl={item.image?.imageUrl}
              imageHint={item.image?.imageHint}
            />
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
