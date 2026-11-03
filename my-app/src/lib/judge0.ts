export interface Judge0Response {
  stdout: string | null;
  time: string;
  memory: number;
  stderr: string | null;
  token: string;
  compile_output: string | null;
  message: string | null;
  status: { id: number; description: string };
}

export async function executeCode(
  code: string,
  languageId: number,
  stdin?: string,
  expectedOutput?: string,
  limits?: { cpu_time_limit?: number; wall_time_limit?: number; memory_limit?: number }
): Promise<Judge0Response> {
  const url = process.env.JUDGE0_API_URL;
  const token = process.env.JUDGE0_AUTH_TOKEN;

  if (!url) {
    throw new Error("Judge0 configuration is missing in environment variables.");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["X-Auth-Token"] = token;
  }

  const payload: any = {
    source_code: code,
    language_id: languageId,
    stdin: stdin || undefined,
    expected_output: expectedOutput || undefined,
  };

  if (limits) {
    if (limits.cpu_time_limit !== undefined) payload.cpu_time_limit = limits.cpu_time_limit;
    if (limits.wall_time_limit !== undefined) payload.wall_time_limit = limits.wall_time_limit;
    if (limits.memory_limit !== undefined) payload.memory_limit = limits.memory_limit;
  }

  const response = await fetch(`${url}/submissions?base64_encoded=false&wait=true`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Judge0 API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data as Judge0Response;
}
