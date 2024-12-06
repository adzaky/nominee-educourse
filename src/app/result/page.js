"use client";
import { toast } from "@/components/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DotsLoader } from "@/components/ui/dots-loader";
import { nomineeService } from "@/services/nominee";
import { useUser } from "@clerk/nextjs";
import { Meh } from "lucide-react";
import { Coffee } from "lucide-react";
import { Shirt } from "lucide-react";
import { Laugh } from "lucide-react";
import { Crown } from "lucide-react";
import { Trophy } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const categoryLabels = {
  mostpopularKing: { label: "Most Popular (King)", icon: Crown },
  mostpopularQueen: { label: "Most Popular (Queen)", icon: Crown },
  mostkind: { label: "Most Kind", icon: Trophy },
  mostfunny: { label: "Most Funny", icon: Laugh },
  mostquiet: { label: "Most Quiet", icon: Meh },
  mostsleepy: { label: "Most Sleepy", icon: Coffee },
  mostfashionable: { label: "Most Fashionable", icon: Shirt },
};

const NominationResult = () => {
  const { user, isLoaded } = useUser();
  const [topNominees, setTopNominees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata.role !== "admin")) {
      redirect("/");
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const fetchTopNominees = async () => {
      setIsLoading(true);
      try {
        const res = await nomineeService.getTopNominees();
        setTopNominees(res.data);
      } catch (err) {
        toast({
          title: "Failed to Get Top Nominees",
          description: `An error occurred while getting top nominees. Error Code: ${err?.status || "N/A"}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopNominees();
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <DotsLoader />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-8">
      <header className="mb-16 w-full text-center lg:max-w-screen-lg">
        <h1 className="mx-auto mb-4 flex w-fit flex-col items-center gap-2 text-3xl font-extrabold">
          <div className="mx-auto size-16 rounded-full border bg-destructive p-3">
            <Trophy className="size-full" />
          </div>
          <span className="mx-auto">Nomination Results</span>
        </h1>
        <Image
          src="/educourse.png"
          alt="Educourse Logo"
          width={200}
          height={200}
          className="mx-auto size-auto grayscale"
          priority
        />
      </header>
      <div className="grid w-full items-center gap-4 lg:max-w-screen-lg lg:grid-cols-2 lg:gap-2">
        <Card className="col-span-2 mb-8 space-y-4 lg:h-96">
          <CardHeader className="flex items-center gap-4 lg:flex-row">
            <Trophy />
            <h2 className="font-bold lg:text-2xl">Most Kind Mentor</h2>
          </CardHeader>
          <CardContent className="space-y-6 lg:space-y-10">
            {topNominees["mostkind_mentor"]?.map((nominee, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex flex-col gap-2">
                  <span>{nominee.name}</span>
                  <span>{nominee.count} Votes</span>
                </div>
                {index === 0 && (
                  <div className="ml-auto size-12 rounded-xl border bg-destructive p-2">
                    <Trophy className="size-full" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
        {Object.entries(categoryLabels).map(([category, { label, icon: Icon }], index) => (
          <Card
            key={category}
            className={`${category === "mostkind" ? "lg:col-span-2" : ""} space-y-4 lg:h-96`}
          >
            <CardHeader className="flex items-center gap-4 lg:flex-row">
              <Icon />
              <h2 className="font-bold lg:text-2xl">{label}</h2>
            </CardHeader>
            <CardContent className="space-y-6 lg:space-y-10">
              {topNominees[category]?.map((nominee, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex flex-col gap-2">
                    <span>{nominee.name}</span>
                    <span>{nominee.count} Votes</span>
                  </div>
                  {index === 0 && (
                    <div className="ml-auto size-12 rounded-xl border bg-destructive p-2">
                      <Trophy className="size-full" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default NominationResult;
