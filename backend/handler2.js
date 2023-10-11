const { PollyClient, StartSpeechSynthesisTaskCommand } = require('@aws-sdk/client-polly');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require("crypto");

const region = "us-east-1";
const pollyClient = new PollyClient({ region });
const s3Client = new S3Client({ region });
const bucketName = "polly-example-1";
const format = "mp3";
let key;

module.exports.speak = async (event, context) => {

  try {
    const input = {
      OutputFormat: format,
      OutputS3BucketName: bucketName,
      Text: "Hello, this is a sample text to be synthesized using Amazon Polly",
      VoiceId: "Bianca"
    };
    const { SynthesisTask } = await pollyClient.send(new StartSpeechSynthesisTaskCommand(input));
    console.log("SpeechSynthesis Complete");

    key = crypto.randomBytes(16).toString("hex");
    const s3Input = {
      Bucket: bucketName,
      Key: key + "." + format,
      Body: SynthesisTask.OutputUri
    };
    const s3Response = await s3Client.send(new PutObjectCommand(s3Input));
    console.log("Pushed to S3 complete");


  } catch (error) {
    console.error("Error Occurred:", error);
  }

};