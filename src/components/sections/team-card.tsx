import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GithubIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/icons';

interface TeamCardProps {
  name: string;
  role: string;
  imageUrl: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export function TeamCard({ name, role, imageUrl, github, linkedin, twitter }: TeamCardProps) {
  return (
    <Card className="group relative overflow-hidden bg-card border border-border/40 hover:border-primary/20 card-hover">
      <CardHeader className="p-0 relative aspect-square overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Social Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all">
              <GithubIcon className="h-5 w-5" />
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all">
              <LinkedinIcon className="h-5 w-5" />
            </a>
          )}
          {twitter && (
            <a href={twitter} target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all">
              <TwitterIcon className="h-5 w-5" />
            </a>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 text-center">
        <h3 className="text-lg font-bold tracking-tight text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1 font-medium">{role}</p>
      </CardContent>
    </Card>
  );
}
