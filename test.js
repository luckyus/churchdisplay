const { IncomingWebhook } = require('@slack/client');
const url = "https://hooks.slack.com/services/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";
const webhook = new IncomingWebhook(url);

// Send simple text to the webhook channel
webhook.send('Hello there', function(err, res) {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('Message sent: ', res);
    }
});