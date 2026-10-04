import SWN = require('senangwebs-notices');
const options: SWN.Options = { position: 'bottom right', timer: 0 };
const notices = new SWN(options);
const alert: Promise<undefined> = notices.show('Saved');
const prompt: Promise<string | null> = notices.showPrompt('Name');
void alert; void prompt;
