import { connectToDatabase } from "@/lib/db";
import { removePrefix, toTitleCase } from "@/lib/utils";
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
        let nominee = nomination[category];
        if (nominee) {
          if (category !== "mostkind_mentor") {
            nominee = removePrefix(nominee);
          }

          const lowerNominee = nominee.toLowerCase();
          voteCount[lowerNominee] = (voteCount[lowerNominee] || 0) + 1;
        }
      });

      const sortedVotes = Object.entries(voteCount).sort((a, b) => b[1] - a[1]);

      return sortedVotes.map(([lowerName, count]) => ({
        name: toTitleCase(lowerName),
        count,
      }));
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
