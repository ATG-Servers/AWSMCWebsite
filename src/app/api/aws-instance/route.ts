import { EC2Client, DescribeInstancesCommand, StartInstancesCommand } from "@aws-sdk/client-ec2";
import { NextResponse } from "next/server";

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

    return NextResponse.json({
      status: instance.State?.Name,
      ip: instance.PublicIpAddress || null,
    });
  } catch (error: any) {
    console.error("Error describing instance:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch instance status" }, { status: 500 });
  }
}

export async function POST() {
  if (!INSTANCE_ID) {
    return NextResponse.json({ error: "Instance ID not configured" }, { status: 500 });
  }

  try {
    const command = new StartInstancesCommand({
      InstanceIds: [INSTANCE_ID],
    });
    await client.send(command);
    return NextResponse.json({ success: true, message: "Instance starting" });
  } catch (error: any) {
    console.error("Error starting instance:", error);
    return NextResponse.json({ error: error.message || "Failed to start instance" }, { status: 500 });
  }
}
