export type ParsedRepositoryUrl =
  | {
      valid: true;
      owner: string;
      repository: string;
      normalizedUrl: string;
    }
  | {
      valid: false;
      message: string;
    };

export function parseRecoveryKeyInput(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const recoveryKey = value.trim();
  return recoveryKey.length > 0 ? recoveryKey : null;
}

export function parseGitHubRepositoryUrl(rawValue: string): ParsedRepositoryUrl {
  const value = rawValue.trim();

  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);

    if (url.hostname.toLowerCase() !== "github.com") {
      return { valid: false, message: "QR does not point to GitHub." };
    }

    const [owner, repository] = url.pathname
      .split("/")
      .filter(Boolean)
      .map((part) => part.trim());

    if (!owner || !repository) {
      return { valid: false, message: "QR is missing repository coordinates." };
    }

    const normalizedRepository = repository.replace(/\.git$/i, "");

    return {
      valid: true,
      owner: owner.toLowerCase(),
      repository: normalizedRepository.toLowerCase(),
      normalizedUrl: `https://github.com/${owner}/${normalizedRepository}`,
    };
  } catch {
    return { valid: false, message: "Malformed QR payload." };
  }
}
