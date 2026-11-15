// components/Footer.tsx
interface FooterProps {
  title?: string;
  subtitle?: string;
}

export default function Footer({ 
  title = "ASTRA CLINICAL CONVERSATION WORKSPACE", 
  subtitle = "SIMULATED TRAINING DATA | HUMAN REVIEW REQUIRED" 
}: FooterProps) {
  return (
    <footer className="bg-[#091b29] border-t border-[#1c5260] p-4 text-center text-[10px] font-mono text-[#8daab5] flex flex-col sm:flex-row justify-between items-center px-6 gap-2">
      <span>{title}</span>
      <span>{subtitle}</span>
    </footer>
  );
}