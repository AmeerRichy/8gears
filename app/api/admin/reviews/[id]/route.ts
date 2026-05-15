import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Review from "@/models/Review";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await context.params;

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await context.params;
    const body = await req.json();

    const updatedReview = await Review.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(updatedReview);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}