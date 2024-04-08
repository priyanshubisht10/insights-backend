const User = require("../models/userModel");
const Video = require("../models/videoModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures"); //unused yet
const axios = require("axios");
const openai = require("../utils/openai");
const fetchComments = require("../utils/fetchComments");
const Comment = require("../models/commentModel");
const scanCheck = require("../utils/scanCheck");

//https://www.googleapis.com/youtube/v3/search?key=AIzaSyBoHoV9An0Mv7xuMZaPLJQbyh12WOKoV_k
//&channelId=UCt9jh--XHPn6O3RpdLpb-pQ&parts=id,snippet

exports.getVideos = catchAsync(async (req, res, next) => {
  const channelId = req.user.channelId;
  if (!channelId) {
    return next(new AppError("User is not linked to any channel", 400));
  }

  const url = `${process.env.YT_API_URL_GETALL}?key=${process.env.YT_API_SECRET}&channelId=${channelId}&parts=id,snippet`;
  console.log(url);

  const response = await axios.get(url);

  //from the response object select only items which are a youtube video (response includes playlists)
  const data = response.data.items.filter(
    (item) => item.id.kind === "youtube#video"
  );

  res.status(200).json({
    status: "success",
    data,
  });
});

/*
1. create the document for the scanned video and add pipelines (Done)
2. add a check to the already scanned comments and not sending it to the gpt-3.5 (Done) 
*/

exports.runScan = catchAsync(async (req, res, next) => {
  const videoId = req.body.videoId;
  // let time1 = Date.now();

  const comments = await fetchComments(videoId);

  let scanList = [];
  let commentsModified = [];

  for (let i = 0; i < comments.length; i++) {
    // if (scanCheck(comments[i].id)) {
    //   console.log("duplicate comment", comments[i].id);
    //   continue;
    // }
    commentsModified.push({
      comment: {
        commentid: comments[i].id,
        commenter:
          comments[i].snippet.topLevelComment.snippet.authorDisplayName,
        comment: comments[i].snippet.topLevelComment.snippet.textOriginal,
      },
    });
    console.log(
      comments[i].snippet.topLevelComment.snippet.authorDisplayName,
      comments[i].snippet.topLevelComment.snippet.textOriginal
    );
  }

  // let time2 = Date.now();
  // console.log(time2 - time1);

  // console.log(commentsModified);

  for (var i = 0; i < commentsModified.length; i++) {
    // time1 = Date.now();
    console.log(commentsModified[i].comment.comment);

    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt:
        `this tool helps to find out if the youtuber should or should not respond to a youtube comment,pointing for errors, question or asking for advices are examples when the reply is needed\n\n` +
        `User: Priyanshu Bisht\n` +
        `Comment: That was a great video! liked it!` +
        `Should reply: No\n\n` +
        `User: Kanika\n` +
        `Comment" Stuck at step-4, how do i do it?` +
        `Should reply: Yes` +
        `User: ${commentsModified[i].comment.commenter}\n` +
        `Comment: ${commentsModified[i].comment.comment}\n` +
        `Should reply:`,
      stop: ["\n", "User:", "Comment:", "Should Reply:"],
      max_tokens: 7,
      temperature: 0,
    });

    // console.log(
    //   completion.choices[0].text.trim(),
    //   commentsModified[i].commenter,
    //   commentsModified[i].comment
    // );
    console.log(completion.choices[0].text.trim());

    if (completion.choices[0].text.trim() === "Yes") {
      const body = {
        commentId: commentsModified[i].comment.commentid,
        text: commentsModified[i].comment.comment,
        user: req.user.id,
        videoId: videoId,
        reply: true,
      };
      const comment = await Comment.create(body);
      scanList.push(comment);
    }
    // time2 = Date.now();
    // console.log(time2 - time1);
  }

  //add the video into the current videoId
  // const video = await Video.create({});
  
  res.status(200).json({
    status: "success",
    results: scanList.length,
    comments: scanList,
  });
});
