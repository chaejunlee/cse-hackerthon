import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import Header from "../components/header";
import { useQuery } from "react-query";
import axios from "axios";

interface teamDataProps {
  team: number;
  applicant: number;
}

function AnimatingNumber({
  number,
  speed,
}: {
  number: number;
  speed: number;
}): JSX.Element {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCount((prev) => {
        let increment = 0;
        if (prev < number) {
          increment = Math.ceil((number - prev) / speed);
        }
        return prev + increment;
      });
    }, 50);
  }, [number, count, speed]);

  return (
    <div
      className={clsx(
        "font-mono transition-all duration-500 ease-out flex text-white underline justify-end",
        count === 0
          ? "opacity-50 scale-50"
          : count === number
          ? "opacity-100 scale-100"
          : "opacity-100 scale-100"
      )}
    >
      {count.toLocaleString()}
    </div>
  );
}

function CurrentlyEnrolledTeam({ team }: { team: number }): JSX.Element {
  return (
    <div className="flex flex-row items-end gap-2 text-5xl">
      <div className="underline">
        <AnimatingNumber number={team} speed={10} />
      </div>
      <p className="self-center text-3xl text-zinc-300">팀</p>
    </div>
  );
}

function CurrentlyEnrolledPeople({
  applicant,
}: {
  applicant: number;
}): JSX.Element {
  return (
    <div className="flex flex-row items-end gap-2 text-5xl">
      <div className="underline ">
        <AnimatingNumber number={applicant} speed={8} />
      </div>
      <p className="self-center text-3xl text-zinc-300">명</p>
    </div>
  );
}

function ApplyButton(): JSX.Element {
  return (
    <div className="fixed flex justify-center left-10 right-10 bottom-10">
      <Link href="/apply">
        <a className="flex justify-center w-full max-w-4xl py-4 text-xl font-bold text-white transition-colors duration-300 ease-in-out bg-yellow-400 rounded-md shadow-2xl cursor-pointer md:py-4 md:text-3xl hover:bg-yellow-600 hover:text-zinc-300 animate-bounce">
          지원하기
        </a>
      </Link>
    </div>
  );
}

const Home: NextPage = () => {
  const { isLoading, error, data } = useQuery<teamDataProps>(["getData"], () =>
    axios.get("api/status").then((res) => {
      return res.data;
    })
  );

  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>2022 경북대학교 컴퓨터학부 해커톤</title>
        <meta
          name="description"
          content="2022년 경북대학교 컴퓨터학부 해커톤"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex flex-col items-center justify-center max-w-2xl mx-auto pb-36">
        <section className="pt-12 mx-auto w-fit md:pt-20">
          <div className="flex flex-col items-center justify-center gap-4 mx-auto w-fit text-zinc-500">
            <h2 className="flex justify-center px-4 text-4xl font-semibold">
              <span className="w-fit text-zinc-200">실시간 지원 정보</span>
            </h2>
            <div className="flex flex-col gap-2 px-4 mx-auto md:flex-row">
              <div className="flex flex-col items-center gap-4 text-xl font-medium text-zinc-300 grow">
                <CurrentlyEnrolledTeam
                  team={isLoading ? -1 : data?.team || 0}
                />
                <CurrentlyEnrolledPeople
                  applicant={isLoading ? -1 : data?.applicant || 0}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 pt-12 mx-auto md:pt-20 w-fit text-zinc-500">
            <h2 className="flex justify-center px-4 text-4xl font-semibold">
              <span className="w-fit text-zinc-200">실시간 기대 상금</span>
            </h2>
            <div className="flex flex-col items-center justify-center gap-2 text-xl w-fit md:flex-col text-zinc-300">
              <p className="block md:inline w-fit">지금 지원하면</p>
              <p className="block md:inline w-fit">기대 상금</p>
            </div>
            <div className="flex flex-row gap-1 text-5xl font-medium text-white">
              <p className="self-center text-3xl">₩</p>
              <AnimatingNumber
                number={Math.floor(
                  (isLoading
                    ? -1
                    : (typeof data === "undefined" ? 1 : data.team) / 24) *
                    10000000
                )}
                speed={2}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-1 italic md:flex-row text-zinc-300">
              <p className="block md:inline w-fit">기대 상금 공식</p>
              <p className="block md:inline w-fit font-extralight">
                (시상 팀 수, 24팀) / (지원 팀 수) * (전체 상금, 1천만원)
              </p>
            </div>
          </div>
        </section>
      </main>
      <ApplyButton />
    </>
  );
};

export default Home;
