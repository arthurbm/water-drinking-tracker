import { AnimatePresence, motion } from "framer-motion";

export const RainOfCups = () => {
  const cupVariants = {
    initial: { y: -100, opacity: 0 },
    animate: {
      y: [0, 300], // Ajuste para definir o ponto inicial e final da animação
      opacity: [0, 1, 0], // Exemplo para fazer o objeto aparecer e depois desaparecer
    },
    exit: { y: 600, opacity: 0 },
  };

  return (
    <AnimatePresence>
      {Array.from({ length: 10 }).map((_, index) => (
        <motion.div
          key={index}
          variants={cupVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            y: { duration: 2, yoyo: Infinity, ease: "linear" },
            opacity: { duration: 2, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            top: 0,
            left: `${10 + index * 10}%`,
          }}
        >
          <GlassWaterIcon className="h-6 w-6" />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

function GlassWaterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.2 22H8.8a2 2 0 0 1-2-1.79L5 3h14l-1.81 17.21A2 2 0 0 1 15.2 22Z" />
      <path d="M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0" />
    </svg>
  );
}
