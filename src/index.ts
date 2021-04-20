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
  cta?: Button;
  attachments?: string | string[];
}


async function send(argv: Arguments) {
  const { title, content, attachments } = argv
  const webhook = new IncomingWebhook(url)
  let blocks = [
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
      }
    ]

  if (attachments) {
    // @ts-ignore
    blocks = blocks.concat((Array.isArray(attachments) ? attachments : [attachments]).map((attachment) => {
      return {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": attachment,
        },
      };
    }))
  }
  const response = await webhook.send({ blocks, })
  if (response.text === 'ok') {
    process.exit(0)
  } else {
    process.exit(1)
  }
}

interface CliArguments {
  title: string;
  content: string;
  ctaText?: string;
  ctaUrl?: string;
  attachment?: string | string[];
}

const argv: CliArguments = yargs(process.argv.slice(2)).options({
  title: { type: 'string', demandOption: true },
  content: { type: 'string', demandOption: true },
  ctaText: { type: 'string' },
  ctaUrl: { type: 'string' },
  attachment: { type: 'string' },
}).argv

const cta = argv.ctaText && argv.ctaUrl ? { text: argv.ctaText, url: argv.ctaUrl } : undefined


const attachments: string | string[] | undefined = argv.attachment

send({ title: argv.title, content: argv.content, cta, attachments })
