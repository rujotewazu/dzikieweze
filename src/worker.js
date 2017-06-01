import azureSB from 'azure-sb';
import {SB_KEY} from '../.env';
import QueueHandler from "./QueueHandler";

const queueHandler = new QueueHandler();
const sbService = azureSB.createServiceBusService(SB_KEY);

sbService.createQueueIfNotExists('poster-request', err => {
    if (err) {
        console.log('Failure ', err);
    } else {
        sbService.receiveQueueMessage(
            'poster-request',
            {isPeekLock: true},
            (error, lockedMessage) => {
                if (error) {
                    console.log('Error: ', error);
                } else {
                    console.log(lockedMessage.body);
                    queueHandler.process(lockedMessage.body);
                    // sbService.deleteMessage(lockedMessage, deleteError => {
                    //     if (deleteError) {
                    //         console.log('Message was not deleted', deleteError);
                    //
                    //         throw deleteError;
                    //     } else {
                    //         console.log('Message deleted');
                    //     }
                    // });
                }
            }
        );
    }
});
