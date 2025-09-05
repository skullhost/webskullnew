import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { 
  EmptyState, 
  EmptyStateIcon, 
  EmptyStateContent, 
  EmptyStateTitle, 
  EmptyStateDescription, 
  EmptyStateAction 
} from "@/components/ui/empty-state.tsx";

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyStateCard({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateCardProps) {
  return (
    <EmptyState className={className}>
      <EmptyStateContent>
        <EmptyStateIcon>
          <Icon />
        </EmptyStateIcon>
        <EmptyStateTitle>{title}</EmptyStateTitle>
        <EmptyStateDescription>{description}</EmptyStateDescription>
        {action && <EmptyStateAction>{action}</EmptyStateAction>}
      </EmptyStateContent>
    </EmptyState>
  );
}
