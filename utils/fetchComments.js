const { google } = require("googleapis");

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YT_API_SECRET,
});

async function getYoutubeComments(videoId) {
  return new Promise((resolve, reject) => {
    youtube.commentThreads.list(
      {
        part: "snippet",
        videoId: videoId,
        maxResults: 100,
      },
      (err, data) => {
        if (err) reject(err);
        resolve(data.data.items);
      }
    );
  });
}

module.exports = getYoutubeComments;
