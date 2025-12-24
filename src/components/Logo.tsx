import { motion } from 'framer-motion';

const Logo = ({ size = 64, className = '' }: { size?: number; className?: string }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
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
        <motion.path
          d="M50 5 L87 27.5 L87 72.5 L50 95 L13 72.5 L13 27.5 Z"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, rotate: -30 }}
          animate={{ pathLength: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
        
        {/* Inner hexagon filled */}
        <motion.path
          d="M50 15 L78 32.5 L78 67.5 L50 85 L22 67.5 L22 32.5 Z"
          fill="url(#innerGradient)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        
        {/* Central P letter stylized */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
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
        </motion.g>
        
        {/* Decorative dots */}
        <motion.circle
          cx="50"
          cy="10"
          r="3"
          fill="hsl(var(--primary))"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
        />
        <motion.circle
          cx="85"
          cy="30"
          r="2.5"
          fill="hsl(var(--accent))"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.1 }}
        />
        <motion.circle
          cx="85"
          cy="70"
          r="2.5"
          fill="hsl(var(--secondary))"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        />
      </svg>
    </motion.div>
  );
};

export default Logo;
