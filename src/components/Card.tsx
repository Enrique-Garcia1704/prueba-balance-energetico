import React from 'react';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Compound Card Component for structured result displays
 */
export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
} = ({ children, style, className = "" }) => {
  return (
    <div
      className={`bento-card bg-surface-container-lowest rounded-none overflow-hidden border border-outline-variant/30 shadow-sm p-sm flex flex-col gap-sm ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

Card.Header = ({ children, style, className = "" }) => {
  return (
    <div
      className={`flex justify-between items-center gap-xs ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

Card.Body = ({ children, style, className = "" }) => {
  return (
    <div
      className={`flex flex-col gap-xs ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

Card.Footer = ({ children, style, className = "" }) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

