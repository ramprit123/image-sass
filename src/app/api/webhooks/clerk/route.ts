/* eslint-disable camelcase */
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.json();

  let evt = payload as WebhookEvent;

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;
  // CREATE
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name ?? "",
      lastName: last_name ?? "",
      photo: image_url,
    };
    const newUser = await createUser(user);
    // Set public metadata
    // if (newUser) {
    //   const client = await clerkClient();
    //   await client.users.updateUserMetadata(id, {
    //     publicMetadata: {
    //       userId: newUser._id,
    //     },
    //   });
    // }

    return NextResponse.json({ message: "OK", user: newUser });
  }

  // UPDATE
  if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name, username } = evt.data;

    const user = {
      firstName: first_name ?? "",
      lastName: last_name ?? "",
      username: username!,
      photo: image_url,
    };

    const updatedUser = await updateUser(id, user);

    return NextResponse.json({ message: "OK", user: updatedUser });
  }

  // DELETE
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const deletedUser = await deleteUser(id!);

    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);

  return new Response("", { status: 200 });
}
