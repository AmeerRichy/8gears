import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db/mongodb';
import AdminUser from '@/models/AdminUser';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const login = credentials?.username?.trim().toLowerCase();
        const password = credentials?.password || '';
        if (!login || !password) return null;

        await connectDB();

        // Safe first-login migration from the existing production credentials.
        if ((await AdminUser.countDocuments()) === 0) {
          const legacyUsername = process.env.ADMIN_USERNAME?.trim().toLowerCase();
          const legacyPassword = process.env.ADMIN_PASSWORD;
          if (legacyUsername && legacyPassword && login === legacyUsername && password === legacyPassword) {
            const bootstrapEmail = (
              process.env.ADMIN_EMAIL ||
              (legacyUsername.includes('@') ? legacyUsername : 'admin@8gears.com')
            ).toLowerCase();
            await AdminUser.create({
              name: 'Administrator',
              email: bootstrapEmail,
              username: legacyUsername,
              passwordHash: await bcrypt.hash(password, 12),
              role: 'super_admin',
              allowedPages: [],
              isActive: true,
            });
          }
        }

        const admin = await AdminUser.findOne({
          $or: [{ email: login }, { username: login }],
        }).select('+passwordHash');

        if (!admin || !admin.isActive || !(await bcrypt.compare(password, admin.passwordHash))) {
          return null;
        }

        admin.lastLoginAt = new Date();
        await admin.save();

        return {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: admin.role,
          allowedPages: admin.allowedPages,
          isActive: admin.isActive,
        };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = user.id;
      if (!token.userId) return token;

      try {
        await connectDB();
        const current = await AdminUser.findById(token.userId)
          .select('name email role allowedPages isActive')
          .lean();
        if (!current) {
          token.isActive = false;
          return token;
        }
        token.name = current.name;
        token.email = current.email;
        token.role = current.role;
        token.allowedPages = current.allowedPages || [];
        token.isActive = current.isActive !== false;
      } catch (error) {
        console.error('Unable to refresh admin permissions:', error);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId || '';
        session.user.role = token.role || 'user';
        session.user.allowedPages = token.allowedPages || [];
        session.user.isActive = token.isActive !== false;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
