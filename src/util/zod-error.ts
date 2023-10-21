export const parseZodError = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "issues" in error &&
    Array.isArray(error.issues) &&
    error.issues.length > 0 &&
    "message" in error.issues[0]
  ) {
    return error.issues[0].message as string;
  }

  return null;
};
