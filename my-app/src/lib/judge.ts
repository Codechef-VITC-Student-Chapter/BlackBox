export type Verdict = 
  | "Accepted"
  | "Wrong Answer"
  | "Time Limit Exceeded"
  | "Compilation Error"
  | "Runtime Error"
  | "Internal Error";

export function getVerdict(statusId: number): Verdict {
  // Mapping based on standard Judge0 status IDs
  switch (statusId) {
    case 3:
      return "Accepted";
    case 4:
      return "Wrong Answer";
    case 5:
      return "Time Limit Exceeded";
    case 6:
      return "Compilation Error";
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
      return "Runtime Error";
    default:
      return "Internal Error";
  }
}
