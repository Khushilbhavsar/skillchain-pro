import { useReducedMotion } from '@/hooks/useReducedMotion';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo = ({ size = 64, className = '' }: LogoProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`relative ${className}`}
      style={{
        animation: prefersReducedMotion ? 'none' : 'logo-enter 0.5s ease-out',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--accent))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
          <linearGradient id="innerGradient" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer hexagon ring */}
        <path
          d="M50 5 L87 27.5 L87 72.5 L50 95 L13 72.5 L13 27.5 Z"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
          className="logo-ring"
          style={{
            strokeDasharray: 280,
            strokeDashoffset: prefersReducedMotion ? 0 : undefined,
          }}
        />
        
        {/* Inner hexagon filled */}
        <path
          d="M50 15 L78 32.5 L78 67.5 L50 85 L22 67.5 L22 32.5 Z"
          fill="url(#innerGradient)"
          className="logo-inner"
        />
        
        {/* Central P letter stylized */}
        <g className="logo-letter">
          {/* P stem */}
          <rect
            x="38"
            y="32"
            width="6"
            height="36"
            rx="2"
            fill="hsl(var(--primary-foreground))"
          />
          {/* P bowl */}
          <path
            d="M44 32 L56 32 C66 32 66 50 56 50 L44 50"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
        </g>
        
        {/* Decorative dots */}
        <circle
          cx="50"
          cy="10"
          r="3"
          fill="hsl(var(--primary))"
          className="logo-dot"
        />
        <circle
          cx="85"
          cy="30"
          r="2.5"
          fill="hsl(var(--accent))"
          className="logo-dot"
        />
        <circle
          cx="85"
          cy="70"
          r="2.5"
          fill="hsl(var(--secondary))"
          className="logo-dot"
        />
      </svg>
    </div>
  );
};

export default Logo;
