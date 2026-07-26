import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { AlertTriangle } from "lucide-react";

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "ACTIVE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "LOCKED", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "LOCKED", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function UnauthorizedSuccessAccess() {
  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-03"
        exeName="ACCESS_DENIED.EXE"
        terminalLabel="NETWORK LABYRINTH GUARD"
        maintenanceSeal="#4093"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="success_route_denied.log"
        baudRate="1200 BAUD"
        ttyNumber="TTY-03"
        directiveTitle="CLASSIFIED DIRECTIVE // ACCESS DENIED"
        directiveText={
          <>
            Success route access requires completed gateway validation.
            <br />
            Finish Module 3 before opening this page.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="DENIED"
        radarSublabel="GATEWAY LOCK ACTIVE"
        bottomBarText="CAUTION: SUCCESS ROUTE LOCKED"
        bottomBarSerial="#8409-NET-DENY"
        wallStencil="CONTROL ROOM 04 // GATEWAY SECTOR"
      >
        <div className="flex-1 overflow-y-auto flex flex-col justify-center gap-4">
          <div className="border border-[#ff3333]/50 bg-[#120606] p-4 font-mono">
            <div className="flex items-center gap-2 text-[#ff3333] text-xs font-bold uppercase tracking-widest mb-3">
              <AlertTriangle size={15} />
              Unauthorized Success Access
            </div>
            <p className="text-[#f59e0b] text-xs leading-relaxed">
              You cannot open the success page without finishing Module 3: Network Labyrinth.
            </p>
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}
