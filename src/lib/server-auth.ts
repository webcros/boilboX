import { createAuthenticatedServerSupabaseClient } from "./supabase";

export class AuthenticationError extends Error {
  statusCode: number;

  constructor(message: string = "Please sign in to continue.") {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = 401;
  }
}

const getBearerToken = (request: Request) => {
  const authHeader = request.headers.get("authorization")?.trim() ?? "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const token = authHeader.slice(7).trim();
  return token || null;
};

export const requireAuthenticatedRequest = async (request: Request) => {
  const accessToken = getBearerToken(request);
  if (!accessToken) {
    throw new AuthenticationError();
  }

  const supabase = createAuthenticatedServerSupabaseClient(accessToken);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    throw new AuthenticationError();
  }

  return {
    accessToken,
    supabase,
    user,
  };
};
