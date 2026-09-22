import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  cookies().set({
    name: "token",
    value: "",
    path: "/",
    expires: new Date(0),
  });

  return NextResponse.json({ success: true });
}