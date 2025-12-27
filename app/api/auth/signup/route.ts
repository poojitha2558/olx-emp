import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!isAllowedEmail(email)) {
      return NextResponse.json(
        { error: `Only @${getAllowedEmailDomain()} email addresses are allowed` },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const db = await getDatabase();
    const users = db.collection('users');

    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      name: name || email.split('@')[0],
      email,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, userId: String(result.insertedId) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error signing up:', error);
    return NextResponse.json({ error: 'Failed to sign up' }, { status: 500 });
  }
}
