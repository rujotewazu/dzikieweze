import azureSB from 'azure-sb';
import {SB_KEY} from '../.env';
import QueueHandler from "./QueueHandler";

const queueHandler = new QueueHandler();
const sbService = azureSB.createServiceBusService(SB_KEY);
queueHandler.process();

// sbService.createQueueIfNotExists('poster-request', err => {
//     if (err) {
//         console.log('Failure ', err);
//     } else {
//         sbService.receiveQueueMessage(
//             'poster-request',
//             {isPeekLock: true},
//             (error, lockedMessage) => {
//                 if (error) {
//                     console.log('Error: ', error);
//                 } else {
//                     queueHandler.process(lockedMessage);
//                 }
//             }
//         );
//     }
// });
