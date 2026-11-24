import AccountShell from "./AccountShell";

export const metadata = { title: "My Account — Shopcart" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
