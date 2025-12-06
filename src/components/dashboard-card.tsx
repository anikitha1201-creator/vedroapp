import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

type DashboardCardProps = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  imageUrl?: string;
  imageHint?: string;
};

export default function DashboardCard({
  title,
  description,
  href,
  icon,
  imageUrl,
  imageHint,
}: DashboardCardProps) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full transition-all duration-300 ease-in-out burnt-edge-pulse torch-flicker">
        <CardHeader>
          {imageUrl && (
            <div className="relative h-40 w-full mb-4 rounded-t-md overflow-hidden">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={imageHint}
              />
            </div>
          )}
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-2 rounded-md">
              {icon}
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-headline">{title}</CardTitle>
            </div>
            <ArrowRight className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
