import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="flex items-center justify-center h-screen">
      <div className="min-w-[320px] ">
        <SignUp />
      </div>
    </section>
  );
}
