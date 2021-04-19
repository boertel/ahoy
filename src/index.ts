import { IncomingWebhook } from "@slack/webhook"
import yargs from "yargs/yargs"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SLACK_WEBHOOK_URL: string;
    }
  }
}

const url:string = process.env.SLACK_WEBHOOK_URL

interface Button {
  text: string;
  url: string;
}

interface Arguments {
  title: string;
  content: string;
  cta?: Button
}

async function send(argv: Arguments) {
  const { title, content, } = argv
  const webhook = new IncomingWebhook(url)
  const blocks = {
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": title,
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": content,
			},
/*
			"accessory": cta ? {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": cta.text,
					"emoji": true
				},
				"value": "cta",
				"url": cta.url,
				"action_id": "button-action"
} : null
*/
		}
	],
/*
	"attachments": [
		{
      "blocks": attachments.map((attachment) => (
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": attachment.text,
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": attachment.cta.text,
              "emoji": true
            },
            "url": attachment.cta.url,
            "value": "view_alternate_1"
          }
        }
      ))
		}
	]
*/
}
  const response = await webhook.send(blocks)
  console.log(response)
}

const argv: Arguments = yargs(process.argv.slice(2)).options({
  title: { type: 'string', demandOption: true },
  content: { type: 'string', demandOption: true },
}).argv

send({ title: argv.title, content: argv.content })
