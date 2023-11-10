import { formattedDateForSQL } from "@/pages/keys";
import supabase, { config } from "@/utilities/supabaseClient";
import { connect } from "@planetscale/database";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Missing authentication token." });
    }

    const keyToken = authorizationHeader.replace("Bearer ", "");
    const conn = connect(config);

    try {
      const findKeyToken: any = await conn.execute(
        `select uid from keys where id = '${keyToken}'`
      );

      const userId = findKeyToken.rows[0].uid;

      if (findKeyToken.rows.length == 0) {
        return res
          .status(401)
          .json({ error: "Unauthorized. Authentication key was not found." });
      }

      try {
        const userLimit = await supabase.rpc("update_monthly_usage", {
          key: userId,
        });

        if (userLimit.data == 1) {
          if (req.body.tags) {
            await conn.execute(
              `insert into events(uid, en, edes, et, ec, ed) values(?,?,?,?,?,?)`,
              [
                userId,
                req.body.title,
                req.body.description ?? null,
                JSON.stringify(req.body.tags),
                req.body.category_id,
                formattedDateForSQL(new Date()),
              ]
            );
          } else {
            await conn.execute(
              `insert into events(uid, en, edes, ec, ed) values(?,?,?,?,?)`,
              [
                userId,
                req.body.title,
                req.body.description ?? null,
                req.body.category_id,
                formattedDateForSQL(new Date()),
              ]
            );
          }

          await conn.execute(
            `UPDATE categories SET t = t + 1 WHERE id = ${req.body.category_id}`
          );

          await conn.execute(
            `UPDATE keys SET lu = ? WHERE id = '${keyToken}'`,
            [formattedDateForSQL(new Date())]
          );

          return res.status(200).json({ message: "Event recorded!" });
        } else {
          res.status(401).json({ error: "Events limit exceeded" });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ error: `Internal Server Error: ${error}` });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};
