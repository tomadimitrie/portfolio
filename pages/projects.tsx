import { GetServerSideProps } from "next";
import prisma from "../globals/prisma";
import { Project } from "@prisma/client";

export default function ProjectsPage({ projects }: { projects: Project[] }) {
  return (
    <div>
      <fieldset className="tui-fieldset w-max h-min border-black">
        <legend className="center">Projects</legend>
        <table className="tui-table hovered-cyan">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.name}>
                <td className="border-white border-r-2 px-2.5">
                  {project.name}
                </td>
                <td className="border-white border-r-2 px-2.5">
                  {project.description}
                </td>
                <td className="px-2.5 underline">
                  <a href={project.link}>link</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </fieldset>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const projects = await prisma.project.findMany({
    orderBy: {
      priority: "asc",
    },
  });
  return {
    props: {
      projects,
    },
  };
};
