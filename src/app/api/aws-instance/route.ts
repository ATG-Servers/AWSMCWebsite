import {
  EC2Client,
  DescribeInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
} from "@aws-sdk/client-ec2";
import {
  SSMClient,
  SendCommandCommand,
  GetCommandInvocationCommand,
} from "@aws-sdk/client-ssm";
import { NextResponse } from "next/server";
import util from "minecraft-server-util";

export const dynamic = "force-dynamic";

const REGION = process.env.AWS_REGION || "us-east-1";
const INSTANCE_ID = process.env.AWS_INSTANCE_ID || "";

const ec2 = new EC2Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const ssm = new SSMClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Helper: Run a bash command on the EC2 instance via SSM and wait for output.
async function runSSMCommand(command: string): Promise<string> {
  const sendResult = await ssm.send(
    new SendCommandCommand({
      InstanceIds: [INSTANCE_ID],
      DocumentName: "AWS-RunShellScript",
      Parameters: { commands: [command] },
    })
  );

  const commandId = sendResult.Command?.CommandId;
  if (!commandId) throw new Error("SSM command ID not returned.");

  // Poll for completion (up to 15s)
  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const result = await ssm.send(
        new GetCommandInvocationCommand({
          CommandId: commandId,
          InstanceId: INSTANCE_ID,
        })
      );
      if (
        result.Status === "Success" ||
        result.Status === "Failed" ||
        result.Status === "Cancelled"
      ) {
        return result.StandardOutputContent || result.StandardErrorContent || "";
      }
    } catch {
      // Still pending, keep polling
    }
  }
  throw new Error("SSM command timed out.");
}

// GET — returns AWS instance state + Minecraft port ping
export async function GET() {
  if (!INSTANCE_ID) {
    return NextResponse.json({ error: "Instance ID not configured" }, { status: 500 });
  }

  try {
    const response = await ec2.send(
      new DescribeInstancesCommand({ InstanceIds: [INSTANCE_ID] })
    );
    const instance = response.Reservations?.[0]?.Instances?.[0];
    if (!instance) {
      return NextResponse.json({ error: "Instance not found" }, { status: 404 });
    }

    let minecraftOnline = false;
    if (instance.State?.Name === "running" && instance.PublicIpAddress) {
      try {
        await util.status(instance.PublicIpAddress, 25565, {
          timeout: 1000,
          enableSRV: false,
        });
        minecraftOnline = true;
      } catch {
        minecraftOnline = false;
      }
    }

    return NextResponse.json({
      status: instance.State?.Name,
      ip: instance.PublicIpAddress || null,
      minecraft_online: minecraftOnline,
    });
  } catch (error: any) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch instance status" },
      { status: 500 }
    );
  }
}

// POST — handles all control actions
export async function POST(req: Request) {
  if (!INSTANCE_ID) {
    return NextResponse.json({ error: "Instance ID not configured" }, { status: 500 });
  }

  const ADMIN_PIN = process.env.ADMIN_PIN;
  let body: any = {};
  try { body = await req.json(); } catch {}

  const action: string = (body.action || "").trim().toLowerCase();
  const pin: string = body.pin || "";

  // All actions except "start-aws" require the admin PIN
  if (action !== "start-aws") {
    if (!ADMIN_PIN) {
      return NextResponse.json({ error: "Server misconfigured: ADMIN_PIN not set" }, { status: 500 });
    }
    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: "Unauthorized. Invalid PIN." }, { status: 401 });
    }
  }

  try {
    // ── START AWS ──────────────────────────────────────────────────────────────
    if (action === "start-aws") {
      // Safety check: don't start if already running
      const desc = await ec2.send(new DescribeInstancesCommand({ InstanceIds: [INSTANCE_ID] }));
      const state = desc.Reservations?.[0]?.Instances?.[0]?.State?.Name;
      if (state === "running" || state === "pending") {
        return NextResponse.json({ error: "AWS instance is already running.", state }, { status: 409 });
      }
      await ec2.send(new StartInstancesCommand({ InstanceIds: [INSTANCE_ID] }));
      return NextResponse.json({ success: true, message: "AWS instance is starting." });
    }

    // ── STOP AWS ───────────────────────────────────────────────────────────────
    if (action === "stop-aws") {
      await ec2.send(new StopInstancesCommand({ InstanceIds: [INSTANCE_ID] }));
      return NextResponse.json({ success: true, message: "AWS instance is stopping." });
    }

    // ── CHECK MC ───────────────────────────────────────────────────────────────
    if (action === "check-mc") {
      const output = await runSSMCommand("bash /home/admin/fabric-server/check-mc.sh");
      let parsed: any = {};
      try { parsed = JSON.parse(output.trim()); } catch {}
      return NextResponse.json({ success: true, mc_status: parsed });
    }

    // ── START MC ───────────────────────────────────────────────────────────────
    if (action === "start-mc") {
      // First check if already running
      const checkOutput = await runSSMCommand("bash /home/admin/fabric-server/check-mc.sh");
      let parsed: any = {};
      try { parsed = JSON.parse(checkOutput.trim()); } catch {}

      if (parsed.service === "active") {
        return NextResponse.json({ success: false, message: "Minecraft is already running!", mc_status: parsed }, { status: 409 });
      }

      await runSSMCommand("sudo systemctl start minecraft");
      return NextResponse.json({ success: true, message: "Minecraft server is starting." });
    }

    // ── STOP MC ────────────────────────────────────────────────────────────────
    if (action === "stop-mc") {
      await runSSMCommand("sudo systemctl stop minecraft");
      return NextResponse.json({ success: true, message: "Minecraft server is stopping." });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });

  } catch (error: any) {
    console.error(`Error during action '${action}':`, error);
    return NextResponse.json(
      { error: error.message || `Failed to execute action: ${action}` },
      { status: 500 }
    );
  }
}
