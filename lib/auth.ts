import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

function getAllowedEmailDomain() {
  return (
    process.env.ALLOWED_EMAIL_DOMAIN ||
    process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN ||
    'company.com'
  );
}

function isAllowedEmail(email?: string | null) {
  if (!email) return false;
  const allowed = getAllowedEmailDomain().toLowerCase().trim();
  const domain = email.split('@')[1]?.toLowerCase();
  return Boolean(domain && domain === allowed);
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString() ?? '';

        if (!email || !password) return null;
        if (!isAllowedEmail(email)) return null;

        const db = await getDatabase();
        const users = db.collection('users');

        const user = await users.findOne<{ _id: ObjectId; name?: string; email: string; passwordHash?: string }>({
          email,
        });

        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: String(user._id),
          name: user.name || email.split('@')[0],
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!isAllowedEmail(user.email)) return false;

      // For OAuth, ensure we have a corresponding user in MongoDB and persist the Mongo _id as user.id
      if (account?.provider === 'google') {
        const db = await getDatabase();
        const users = db.collection('users');

        const email = String(user.email).toLowerCase();
        const name = user.name || email.split('@')[0];

        const existing = await users.findOne<{ _id: ObjectId }>({ email });

        if (!existing) {
          const result = await users.insertOne({
            email,
            name,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          user.id = String(result.insertedId);
        } else {
          user.id = String(existing._id);
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid || token.sub;
      }
      return session;
    },
  },
};
