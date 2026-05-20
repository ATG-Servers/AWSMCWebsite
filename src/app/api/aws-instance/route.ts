import { EC2Client, DescribeInstancesCommand, StartInstancesCommand, StopInstancesCommand, RebootInstancesCommand } from "@aws-sdk/client-ec2";
import { NextResponse } from "next/server";
import util from "minecraft-server-util";

export const dynamic = 'force-dynamic';

// Initialize the EC2 client. It will automatically use AWS_ACCESS_KEY_ID, 
// AWS_SECRET_ACCESS_KEY, and AWS_REGION environment variables.
const client = new EC2Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }
});

const INSTANCE_ID = process.env.AWS_INSTANCE_ID || "";

export async function GET() {
  if (!INSTANCE_ID) {
    return NextResponse.json({ error: "Instance ID not configured" }, { status: 500 });
  }

  try {
    const command = new DescribeInstancesCommand({
      InstanceIds: [INSTANCE_ID],
    });
    const response = await client.send(command);
    const instance = response.Reservations?.[0]?.Instances?.[0];

    if (!instance) {
      return NextResponse.json({ error: "Instance not found" }, { status: 404 });
    }

    let minecraftOnline = false;
    
    // Only attempt to ping if the instance is fully running and has an IP
    if (instance.State?.Name === "running" && instance.PublicIpAddress) {
      try {
        // Fast 1 second timeout ping just to see if port 25565 is responding
        await util.status(instance.PublicIpAddress, 25565, { timeout: 1000, enableSRV: false });
        minecraftOnline = true;
      } catch (err) {
        // Ping failed, meaning the server is still booting or crashed
        minecraftOnline = false;
      }
    }

    return NextResponse.json({
      status: instance.State?.Name,
      ip: instance.PublicIpAddress || null,
      minecraft_online: minecraftOnline,
    });
  } catch (error: any) {
    console.error("Error describing instance:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch instance status" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!INSTANCE_ID) {
    return NextResponse.json({ error: "Instance ID not configured" }, { status: 500 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || "start";
    const pin = body.pin;

    if (action === "stop" || action === "reboot") {
      const ADMIN_PIN = process.env.ADMIN_PIN;
      if (!ADMIN_PIN) {
        return NextResponse.json({ error: "Server misconfigured: ADMIN_PIN not set" }, { status: 500 });
      }
      if (pin !== ADMIN_PIN) {
        return NextResponse.json({ error: "Unauthorized. Invalid PIN." }, { status: 401 });
      }
    }

    if (action === "stop") {
      const command = new StopInstancesCommand({
        InstanceIds: [INSTANCE_ID],
      });
      await client.send(command);
      return NextResponse.json({ success: true, message: "Instance stopping" });
    } else if (action === "reboot") {
      const command = new RebootInstancesCommand({
        InstanceIds: [INSTANCE_ID],
      });
      await client.send(command);
      return NextResponse.json({ success: true, message: "Instance rebooting" });
    } else {
      const command = new StartInstancesCommand({
        InstanceIds: [INSTANCE_ID],
      });
      await client.send(command);
      return NextResponse.json({ success: true, message: "Instance starting" });
    }
  } catch (error: any) {
    console.error("Error modifying instance:", error);
    return NextResponse.json({ error: error.message || "Failed to execute action" }, { status: 500 });
  }
}
