import { Redirect } from "expo-router";
import { useAuthStore } from "../src/stores/authStore";

export default function Index() {
  const { session } = useAuthStore();

  return <Redirect href={session ? "/(main)/home" : "/(auth)/login"} />;
}
