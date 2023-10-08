# Building a Talking App

### Backend

1. Create a serverless project using `serverless create --template aws-nodejs --path backend`
2. Add below template

~~~yml
service: talking-backend 
frameworkVersion: "3"

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  iam:
    role: <role-arn>
  profile: <profile-name>

functions:
  hello:
    handler: handler.speak
    events:
      - http:
          path: speak
          method: post
          cors: true
~~~

3. Create a S3 bucket to store mp3 files
4. Create a Role with below policies

~~~json
{
	"Version": "2012-10-17",
	"Statement": [
		{
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "polly:*",
                "s3:PutAccountPublicAccessBlock",
                "s3:GetAccountPublicAccessBlock",
                "s3:ListAllMyBuckets"
            ],
            "Resource": "*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::polly-example-1",
                "arn:aws:s3:::polly-example-1/*"
            ]
        }
	]
}
~~~

### FrontEnd
5. Install below dependencies

~~~text
npm install aws-sdk
npm install uuid
~~~
6. Use `sls deploy` to push changes to AWS
7. Create an Angular project using `ng new <project-name>`
8. Generate a new API using `ng g s <api-name>`
9. Add below code to the API file

~~~ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class APIService {
  ENDPOINT = '<api-endpoint>';
  constructor(private http: HttpClient) { }
  speak(data) {
    return this.http.post(this.ENDPOINT, data);
  }
}
~~~