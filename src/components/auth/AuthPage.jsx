import TestimonialCarousel from "./TestimonialCarousel";
import AuthForm from "./AuthForm";

const AuthPage = () => {
  return (
    <div className="flex h-screen w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-cyan-100 selection:text-cyan-900 dark:selection:bg-cyan-900 dark:selection:text-cyan-100 overflow-hidden">
      <TestimonialCarousel />
      <AuthForm />
    </div>
  );
};

export default AuthPage;