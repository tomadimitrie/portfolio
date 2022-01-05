import { GetServerSideProps } from "next";
import prisma from "../globals/prisma";
import { Skill, SkillCategory } from "@prisma/client";

export default function SkillsPage({
  skills,
}: {
  skills: (SkillCategory & { skills: Skill[] })[];
}) {
  return (
    <div className="flex gap-x-5 flex-wrap">
      {skills.map(({ name: category, skills: items }) => (
        <fieldset
          key={category}
          className="tui-fieldset w-max h-min border-black"
        >
          <legend className="center">{category}</legend>
          <table className="tui-table hovered-cyan">
            <tbody>
              {items.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </fieldset>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const skills = await prisma.skillCategory.findMany({
    include: {
      skills: {
        orderBy: {
          priority: "asc",
        },
      },
    },
    orderBy: {
      priority: "asc",
    },
  });
  return {
    props: {
      skills,
    },
  };
};
