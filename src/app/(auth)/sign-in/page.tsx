import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <section className="flex items-center justify-center h-screen">
      <div className="min-w-[320px] ">
        <LoginForm />
      </div>
    </section>
  );
}
