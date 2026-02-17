import TestimonialCarousel from "./TestimonialCarousel";
import AuthForm from "./AuthForm";

const AuthPage = () => {
  return (
    <div className="flex h-screen w-full bg-white text-zinc-900 font-sans selection:bg-cyan-100 selection:text-cyan-900 overflow-hidden">
      <TestimonialCarousel />
      <AuthForm />
    </div>
  );
};

export default AuthPage;