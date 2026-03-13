import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";
import { useClerk } from "@clerk/nextjs";

interface UnauthorizedProps {
  title?: string;
  message?: string;
  signOutLabel?: string;
}

export function Unauthorized({
  title = "Access Denied",
  message = "You do not have permission to view this page.",
  signOutLabel = "Sign Out",
}: UnauthorizedProps) {
  const { signOut } = useClerk();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '24px',
      backgroundColor: 'var(--bg-main)',
      color: 'var(--text-primary)',
      textAlign: 'center'
    }}>
      <AlertTriangle size={64} color="var(--stat-red)" style={{ marginBottom: '24px' }} aria-hidden="true" />
      <h1 style={{ fontSize: '2rem', marginBottom: '16px', fontWeight: 700 }}>{title}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px', lineHeight: 1.5 }}>
        {message}
      </p>
      <Button onClick={() => signOut()} variant="primary">
        {signOutLabel}
      </Button>
    </div>
  );
}
