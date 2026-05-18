import { createClient } from "../../supabase/server";
import { DomainError, ErrorCodes } from "../services/errors";

export async function requireUserSession() {
  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session?.user) {
    throw new DomainError(ErrorCodes.UNAUTHORIZED, "Unauthenticated");
  }

  return { supabase, user: session.user };
}
