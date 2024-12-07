import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await connectToDatabase();
  const db = client.db();

  try {
    const nominees = await db.collection("nominees").find().toArray();

    if (nominees.length === 0) {
      return NextResponse.json({ message: "No nominees found" });
    }

    const categories = [
      "mostkind_mentor",
      "mostpopularKing",
      "mostpopularQueen",
      "mostkind",
      "mostfunny",
      "mostquiet",
      "mostsleepy",
      "mostfashionable",
    ];

    const calculateNomination = (category) => {
      const voteCount = {};

      nominees.forEach((nomination) => {
        const nominee = nomination[category];
        if (nominee) {
          voteCount[nominee] = (voteCount[nominee] || 0) + 1;
        }
      });

      const sortedVotes = Object.entries(voteCount).sort((a, b) => b[1] - a[1]);

      return sortedVotes.map(([name, count]) => ({ name, count }));
    };

    const results = {};
    categories.forEach((category) => {
      results[category] = calculateNomination(category);
    });

    return NextResponse.json(results);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  } finally {
    client.close();
  }
}
