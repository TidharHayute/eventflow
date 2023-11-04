import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClientComponentClient({ supabaseUrl, supabaseKey });

export default supabase;

export const config = {
  host: process.env.NEXT_PUBLIC_PS_HOST,
  username: process.env.NEXT_PUBLIC_PS_USER,
  password: process.env.NEXT_PUBLIC_PS_PASS,
};
