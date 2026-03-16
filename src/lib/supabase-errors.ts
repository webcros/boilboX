const MISSING_TABLE_PATTERNS = [
  /Could not find the table ['"]?public\.(orders|user_carts)['"]? in the schema cache/i,
  /relation ['"]?public\.(orders|user_carts)['"]? does not exist/i,
];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message
  ) {
    return error.message;
  }

  if (typeof error === "string" && error) {
    return error;
  }

  return fallback;
};

const getMissingTableName = (message: string) => {
  for (const pattern of MISSING_TABLE_PATTERNS) {
    const match = message.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
};

export const isMissingSupabaseTableError = (error: unknown) => {
  const message = getErrorMessage(error, "");
  return Boolean(getMissingTableName(message));
};

export const getReadableSupabaseErrorMessage = (
  error: unknown,
  fallback: string,
) => {
  const message = getErrorMessage(error, fallback);
  const missingTable = getMissingTableName(message);

  if (!missingTable) {
    return message;
  }

  return `Supabase table public.${missingTable} is missing in the connected project. Run supabase_migration_auth_cart_orders.sql in the Supabase SQL editor, then retry.`;
};
