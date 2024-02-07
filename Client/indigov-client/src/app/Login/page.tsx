import { Metadata } from "next";
import UserAuthForm from "./UserAuthForm";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function Login() {
  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center grid max-w-none grid-cols-2 px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-amber-50" />
          <div className="relative z-20 flex items-center text-4xl font-bold text-black">
            Indigov
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg text-black">
                &ldquo;A next generation constituent experience management
                platform designed for government.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  );
}
