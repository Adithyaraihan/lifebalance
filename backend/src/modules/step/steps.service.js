import { prisma } from "../db/database.js";
import axios from "axios";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export const getStepsService = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.googleRefreshToken) {
    throw new Error("User belum menghubungkan Google Fit");
  }

  oauth2Client.setCredentials({
    refresh_token: user.googleRefreshToken,
  });

  // Dapatkan Access Token baru
  const { token } = await oauth2Client.getAccessToken();

  // Request ke Google Fit
  const aggregate = await axios.post(
    "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
    {
      aggregateBy: [{ dataTypeName: "com.google.step_count.delta" }],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis: Date.now() - 7 * 24 * 60 * 60 * 1000,
      endTimeMillis: Date.now(),
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const buckets = aggregate.data.bucket || [];

  return buckets.map((b) => {
    const steps = b.dataset[0]?.point.reduce(
      (sum, p) => sum + (p.value[0]?.intVal || 0),
      0
    );

    const date = new Date(Number(b.startTimeMillis)).toLocaleDateString(
      "id-ID",
      { weekday: "short", day: "2-digit", month: "short" }
    );

    return { date, steps };
  });
};
