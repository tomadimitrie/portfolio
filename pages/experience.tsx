import { GetServerSideProps } from "next";
import prisma from "../globals/prisma";
import { Experience, ExperienceCategory, Award } from "@prisma/client";
import { DateTime } from "luxon";

export default function ExperiencePage({
  experience,
  awards,
}: {
  experience: (ExperienceCategory & { experience: Experience[] })[];
  awards: Award[];
}) {
  return (
    <div className="flex gap-x-5 flex-wrap">
      {experience.map(({ name: categoryName, experience }) => (
        <fieldset
          key={categoryName}
          className="tui-fieldset w-max h-min border-black"
        >
          <legend className="center">{categoryName}</legend>
          <table className="tui-table hovered-cyan">
            <thead>
              <tr>
                <th>What</th>
                <th>Where</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {experience.map((item) => (
                <tr key={item.id}>
                  <td className="border-white border-r-2 px-2.5">
                    {item.position}
                  </td>
                  <td className="border-white border-r-2 px-2.5">
                    {item.company}
                  </td>
                  <td className="border-white border-r-2 px-2.5">
                    {DateTime.fromJSDate(item.from).toFormat("MMMM y")}
                  </td>
                  <td className="px-2.5">
                    {item.to
                      ? DateTime.fromJSDate(item.to).toFormat("MMMM y")
                      : "Ongoing"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </fieldset>
      ))}
      <fieldset className="tui-fieldset w-max h-min border-black">
        <legend className="center">Awards</legend>
        <table className="tui-table hovered-cyan">
          <thead>
            <tr>
              <th>What</th>
              <th>Where</th>
            </tr>
          </thead>
          <tbody>
            {awards.map((item) => (
              <tr key={item.id}>
                <td className="border-white border-r-2 px-2.5">{item.award}</td>
                <td className="px-2.5">{item.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </fieldset>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const experience = await prisma.experienceCategory.findMany({
    include: {
      experience: {
        orderBy: {
          priority: "asc",
        },
      },
    },
    orderBy: {
      priority: "asc",
    },
  });
  const awards = await prisma.award.findMany({
    orderBy: {
      priority: "asc",
    },
  });
  return {
    props: {
      experience,
      awards,
    },
  };
};
