var azure = require('azure-storage');

var queueService = azure.createQueueService(),
    queueName = 'taskqueue';
queueService.getMessages(queueName, function(error, serverMessages) {
    if (!error) {
        // Process the message in less than 30 seconds, the message
        // text is available in serverMessages[0].messageText

        queueService.deleteMessage(queueName, serverMessages[0].messageId, serverMessages[0].popReceipt, function(error) {
            if (!error) {
                // Message deleted
            }
        });
    }
});
