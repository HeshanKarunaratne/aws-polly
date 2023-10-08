const { Polly, S3 } = require('@aws-sdk/client-polly');
const { S3Client, PutObjectCommand, GetObjectCommand, GetObjectUrlCommand } = require('@aws-sdk/client-s3');

const pollyClient = new Polly({ region: 'us-east-1' });
const s3Client = new S3Client({ region: 'us-east-1' });

module.exports.speak = async (event, context) => {
  try {
    const data = JSON.parse(event.body);
    const pollyParams = {
      OutputFormat: 'mp3',
      Text: data.text,
      VoiceId: data.voice
    };

    // 1. Getting the audio stream for the text that the user entered
    const pollyResponse = await pollyClient.synthesizeSpeech(pollyParams);

    const audioStream = pollyResponse.AudioStream;
    const key = "trwts4524ss";
    const s3BucketName = 'polly-example-1'; // Replace with your S3 bucket name

    // 2. Saving the audio stream to S3
    const audioBuffer = Buffer.from(await streamToBuffer(audioStream));
    const s3Params = {
      Bucket: s3BucketName,
      Key: key + '.mp3',
      Body: audioBuffer
    };

    await s3Client.send(new PutObjectCommand(s3Params));

    // 3. Getting a signed URL for the saved mp3 file
    const s3UrlParams = {
      Bucket: s3BucketName,
      Key: key + '.mp3',
    };
    const url = await s3Client.send(new GetObjectUrlCommand(s3UrlParams));

    // Sending the result back to the user
    const result = {
      bucket: s3BucketName,
      key: key + '.mp3',
      url: url,
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(err)
    };
  }


};

// Helper function to convert a readable stream to a buffer
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}