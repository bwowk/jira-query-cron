# hubot-jira-query-cron

A hubot script to set up JQL queries to be run on a schedule using the crontab format, outputing the tickets to the chat.

See [`src/jira-query-cron.coffee`](src/jira-query-cron.coffee) for full documentation.

## Installation

In hubot project repo, run:

`npm install hubot-jira-query-cron --save`

Then add **hubot-jira-query-cron** to your `external-scripts.json`:

```json
[
  "hubot-jira-query-cron"
]
```

## Sample Interaction

```
user1>> hubot hello
hubot>> hello!
```

## NPM Module

https://www.npmjs.com/package/hubot-jira-query-cron
