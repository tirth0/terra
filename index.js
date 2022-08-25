ACCOUNT_SID = 'ACbe1f644907be2b67d39f362ece9a46a5'
AUTH_TOKEN = '6e6884b26b1e59e677d010afe220aa95'
SERVICE_SID = 'ISad15ded3cf8485809d9ceba389ef8365'
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
   
// User-defined function to send bulk SMS to desired
// numbers bypassing numbers list as parameter
function sendBulkMessages(messageBody, numberList)
{
    var numbers = [];
    for(i = 0; i < numberList.length; i++)
    {
        numbers.push(JSON.stringify({ 
            binding_type: 'sms', address: numberList[i]}))
    }
   console.log(numbers);
    const notificationOpts = {
      toBinding: numbers,
      body: messageBody,
    };
   
    client.notify
    .services(SERVICE_SID)
    .notifications.create(notificationOpts)
    .then(notification => console.log(notification.sid))
    .catch(error => console.log(error));
}
     
// Sending our custom message to all numbers
// mentioned in array.
sendBulkMessages('Get insights about your field',
      ['+918303357744', '+919903009279'])