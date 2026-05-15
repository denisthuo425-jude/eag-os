import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to dashboard by default since auth is mocked for now
  redirect("/dashboard");
}
