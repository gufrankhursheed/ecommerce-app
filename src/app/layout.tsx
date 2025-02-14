import type { Metadata } from "next";
import { Poppins } from "next/font/google"
import "./globals.css";
import { CartContextProvider } from './context/CartContext';
import { Toaster } from "react-hot-toast";
import { auth } from "@/auth";
import Header from "./components/Header";
import { AuthProvider } from "./context/AuthContext";

const pop = Poppins({ subsets: ["latin"], weight: '400' })

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user

  return (
    <html lang="en">
      <body
        className={`${pop.className} antialiased `}
      >
        <AuthProvider>
          <CartContextProvider>
            <Header user={user} />
            {children}
            <Toaster
              position="top-center"
              reverseOrder={false}
            />
          </CartContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
