import React from 'react';
import {
  Card as ShadcnCard,
  CardContent as ShadcnCardContent,
  CardFooter as ShadcnCardFooter,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
} from '@/components/ui/card';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => (
  <ShadcnCard className={`max-w-[80%] w-[300px] ${className}`}>{children}</ShadcnCard>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <ShadcnCardHeader>{children}</ShadcnCardHeader>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <ShadcnCardTitle>{children}</ShadcnCardTitle>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <ShadcnCardContent>{children}</ShadcnCardContent>
);

const CardFooter = ({ children }: { children: React.ReactNode }) => (
  <ShadcnCardFooter>{children}</ShadcnCardFooter>
);

// Compose the compound component
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;