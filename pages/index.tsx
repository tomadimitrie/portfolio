import { GetServerSideProps } from "next";
import { Fragment } from "react";
import prisma from "../globals/prisma";
import { Info } from "@prisma/client";

export default function HomePage({ info }: { info: Info[] }) {
  const maxText = info.reduce((a, b) =>
    a.key.length <= b.key.length ? b : a
  ).key;

  const renderEllipsis = (text: string) =>
    ".".repeat(maxText.length - text.length + 3);

  return (
    <div>
      <fieldset className="tui-fieldset border-black">
        <legend>Info</legend>
        <table className="tui-table">
          <tbody>
            <tr>
              <td className="grid grid-cols-[min-content_auto] gap-x-5">
                {info.map(({ key, value, continuation, href }) => (
                  <Fragment key={key}>
                    <div className="blue-168-text">
                      {!continuation && (
                        <>
                          {key}
                          {renderEllipsis(key)}
                        </>
                      )}
                    </div>
                    {href ? (
                      <a className="underline" href={href}>
                        {value}
                      </a>
                    ) : (
                      <div>{value}</div>
                    )}
                  </Fragment>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </fieldset>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const info = await prisma.info.findMany({
    orderBy: {
      priority: "asc",
    },
  });
  return {
    props: {
      info,
    },
  };
};
