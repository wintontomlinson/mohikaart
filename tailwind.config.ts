import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Playfair Display", "Cormorant Garamond", "serif"],
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Inter", "DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        ivory: "hsl(var(--ivory))",
        champagne: {
          DEFAULT: "hsl(var(--champagne))",
          deep: "hsl(var(--champagne-deep))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          soft: "hsl(var(--gold-soft))",
        },
        blush: {
          DEFAULT: "hsl(var(--blush))",
          deep: "hsl(var(--blush-deep))",
        },
        beige: "hsl(var(--beige))",
        lavender: "hsl(var(--lavender))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in": { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(40px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(0.95)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        "slide-in-left": { "0%": { opacity: "0", transform: "translateX(-40px) rotateY(8deg)" }, "100%": { opacity: "1", transform: "translateX(0) rotateY(0)" } },
        "slide-in-right": { "0%": { opacity: "0", transform: "translateX(40px) rotateY(-8deg)" }, "100%": { opacity: "1", transform: "translateX(0) rotateY(0)" } },
        "rotate-in": { "0%": { opacity: "0", transform: "perspective(1000px) rotateX(20deg) translateY(30px)" }, "100%": { opacity: "1", transform: "perspective(1000px) rotateX(0) translateY(0)" } },
        "bounce-in": { "0%": { opacity: "0", transform: "scale(0.3)" }, "50%": { transform: "scale(1.05)" }, "70%": { transform: "scale(0.9)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        "float-3d": { "0%, 100%": { transform: "translateY(0) rotateX(0) rotateY(0)" }, "25%": { transform: "translateY(-10px) rotateX(2deg) rotateY(1deg)" }, "50%": { transform: "translateY(-18px) rotateX(0) rotateY(-1deg)" }, "75%": { transform: "translateY(-10px) rotateX(-2deg) rotateY(1deg)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.8s cubic-bezier(0.22,1,0.36,1) both",
        "fade-up": "fade-up 1s cubic-bezier(0.22,1,0.36,1) both",
        "scale-in": "scale-in 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "slide-in-left": "slide-in-left 0.8s cubic-bezier(0.22,1,0.36,1) both",
        "slide-in-right": "slide-in-right 0.8s cubic-bezier(0.22,1,0.36,1) both",
        "rotate-in": "rotate-in 0.9s cubic-bezier(0.22,1,0.36,1) both",
        "bounce-in": "bounce-in 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "float-3d": "float-3d 8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
