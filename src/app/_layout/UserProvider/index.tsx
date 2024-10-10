"use client";

import { onAuthStateChanged } from "@/modules/api/client";
import { User } from "firebase/auth";
import React from "react";

interface UserContext {
  user: User | null;
  isLoading: boolean;
}

const UserContext = React.createContext<UserContext | null>(null);

function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged({
      next: (user) => {
        setIsLoading(false);

        if (user) {
          setUser(user);
        }
      },
      error: (error) => {},
      complete: () => {
        setIsLoading(false);
      },
    });

    return function onUnmount() {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

function useUserContext() {
  const context = React.useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

function useUser() {
  const { user } = useUserContext();
  if (!user) {
    throw new Error("User is not authenticated");
  }
  return { user };
}

export default UserProvider;
export { useUser, useUserContext };
