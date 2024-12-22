import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export const createSupabaseMiddleware = async (req: any, res: any) => {
  const supabase = createMiddlewareSupabaseClient({ req, res });
  return supabase;
};
