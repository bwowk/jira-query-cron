/*Description
  A hubot script to set up JQL queries to be run on a schedule using the crontab format, outputing the tickets to the chat.
Configuration:
  JIRA_HOST
  JIRA_USERNAME
  JIRA_PASSWORD
Commands:
  hubot hello - <what the respond trigger does>
  orly - <what the hear trigger does>
 Notes:
  <optional notes required for the script>
Author:Bruno Wowk
*/


module.exports = function(robot) {
    "use strict";

    var JiraClient = require('jira-connector');
    var CronJob = require('cron').CronJob;
    var jira = new JiraClient({
        host: process.env.JIRA_HOST,
        basic_auth: {
            username: process.env.JIRA_USERNAME,
            password: process.env.JIRA_PASSWORD
        }
        var DATASTORE_NAME = 'jira-query-cron';
        var data = null;
    });

    //schedule new cronjob for every weekday at 8 AM
    // var job = new CronJob({
    //     cronTime: '0 8 * * 1-5',
    //     onTick: function() {
    //         console.log('You will see this message every minute');

    //          * Runs every weekday (Monday through Friday)
    //          * at 11:30:00 AM. It does not run on Saturday
    //          * or Sunday.

    //     },
    //     start: true,
    //     timeZone: 'America/Sao_Paulo'
    // });

    function init(){
        initData();
    }

    function initData() {
        this.data = pullData();
        if (this.data == null){
            this.data = {
                templates: {}
                crontab: []
            }
            pushData();
            console.log(data);
        }
    }

    function pullData() {
        this.data = robot.brain.get(DATASTORE_NAME);
    }

    fucntion pushData() {
        robot.brain.set(DATASTORE_NAME,this.data);
    }

    function addTemplate(name, fields) {

    }

    function getTemplate(name) {
        return robot.brain.get('')
    }

    function issuesToAttachment(issues) {
        var attachments = [];

        for (var i = 0; i < issues.length; i++) {
            var issue = issues[i];
            var status = issue.fields.status.name;
            var assignee = issue.fields.assignee ? issue.fields.assignee.emailAddress : false;
            var color = (issue.fields.assignee && issue.fields.duedate) ? "good" : "warning";
            var duedate = issue.fields.duedate ? issue.fields.duedate : ":exclamation:Sem due date";
            if (!issue.fields.duedate) color = "danger";

            attachments.push({
                color: color,
                fallback: issue.key,
                title: issue.key,
                title_link: "https://jiracloud.cit.com.br/browse/" + issue.key,
                text: '*[' + issue.fields.parent.fields.summary + ']* ' + issue.fields.summary,
                mrkdwn_in: ["text"],
                fields: [{
                    "title": "Assignee",
                    "value": assignee,
                    "short": true
                }, {
                    "title": "Due date",
                    "value": duedate,
                    "short": true
                }]
            });

        }

        var msgData = {
            text: 'Fazer follow-up dos blocks:',
            as_user: true,
            username: robot.name,
            attachments: attachments
        };

        robot.messageRoom('blocks', msgData);
    }

    function jiraQuery(query, callback) {
        jira.search.search({
            jql: query
        }, callback);

    }

    function addCron(cronTime,timeZone,jql,groupBy){

    }

    // robot.respond(/podv-(\d+)/i, function(res) {
    //     if (res.message.user.name !== 'hubot') jiraTout(res);
    // });

    jiraQuery("project = PODV AND issueType = Sub-block \
        AND (duedate <= endOfDay() OR duedate is empty) \
        AND status not in ('Closed','Cancelled') \
        ORDER BY id ASC", function(error, data) {
        // console.log(data.issues[0].fields.parent);
        if (data) issuesToAttachment(data.issues);

    });

    //retries cron entries from
    getCrontab(){

    }
    init();
    return robot;
};

