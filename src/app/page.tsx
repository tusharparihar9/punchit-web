import { redirect } from "next/navigation";

export default function Home() {
  // Redirect users visiting the root domain directly to the login page
  redirect("/login");
}
