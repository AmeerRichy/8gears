import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    role?: string;
    allowedPages?: string[];
    isActive?: boolean;
  }

  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
      allowedPages: string[];
      isActive: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    role?: string;
    allowedPages?: string[];
    isActive?: boolean;
  }
}
