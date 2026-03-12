"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DbConnection,
  type ErrorContext,
  type SubscriptionHandle,
} from "./module_bindings";

interface SpacetimeDBContextValue {
  connection: DbConnection | null;
  connected: boolean;
  error: string | null;
}

const SpacetimeDBContext = createContext<SpacetimeDBContextValue>({
  connection: null,
  connected: false,
  error: null,
});

export interface SpacetimeDBProviderProps {
  children: ReactNode;
  host: string;
  moduleName: string;
  authToken?: string;
}

export function SpacetimeDBProvider({
  children,
  host,
  moduleName,
  authToken,
}: SpacetimeDBProviderProps) {
  const [connection, setConnection] = useState<DbConnection | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const connRef = useRef<DbConnection | null>(null);
  const subRef = useRef<SubscriptionHandle | null>(null);

  useEffect(() => {
    const builder = DbConnection.builder()
      .withUri(host)
      .withDatabaseName(moduleName)
      .onConnect((conn: DbConnection) => {
        setConnected(true);
        setError(null);
        connRef.current = conn;

        const handle = conn
          .subscriptionBuilder()
          .onApplied(() => {})
          .subscribe([
            "SELECT * FROM book",
            "SELECT * FROM library_user",
            "SELECT * FROM branch",
            "SELECT * FROM borrow_record",
            "SELECT * FROM notification",
            "SELECT * FROM ai_generation",
          ]);
        subRef.current = handle;
      })
      .onDisconnect(() => {
        setConnected(false);
      })
      .onConnectError((_ctx: ErrorContext, e: Error) => {
        setError(String(e));
        setConnected(false);
      });

    if (authToken) {
      builder.withToken(authToken);
    }

    const conn = builder.build();
    setConnection(conn);
    connRef.current = conn;

    return () => {
      if (subRef.current) {
        subRef.current.unsubscribe();
      }
      if (connRef.current) {
        connRef.current.disconnect();
      }
    };
  }, [host, moduleName, authToken]);

  return (
    <SpacetimeDBContext.Provider value={{ connection, connected, error }}>
      {children}
    </SpacetimeDBContext.Provider>
  );
}

export function useSpacetimeDB() {
  return useContext(SpacetimeDBContext);
}

export function useDbConnection(): DbConnection {
  const ctx = useContext(SpacetimeDBContext);
  if (!ctx.connection) {
    throw new Error(
      "useDbConnection must be used inside SpacetimeDBProvider after connection is established",
    );
  }
  return ctx.connection;
}
