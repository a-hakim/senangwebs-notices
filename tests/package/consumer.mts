import SWN from 'senangwebs-notices';
const options: SWN.Options<number> = { inputType: 'number', bgOpacity: 0, preConfirm: value => Promise.resolve(Number(value)) };
const notices = new SWN(options);
const transformedPrompt: Promise<number | string | null> = notices.showPrompt('Number');
const result: Promise<SWN.SwNResult<number | string | boolean | null | undefined>> = notices.fire<number>({ ...options, type: 'prompt', body: 'Number' });
const confirmed: Promise<boolean> = notices.showConfirm('Continue?');
void result; void confirmed; void transformedPrompt;
// @ts-expect-error unsupported positions must be rejected by the declarations
new SWN({ position: 'outside' });
// @ts-expect-error unknown input types must be rejected
notices.fire({ inputType: 'file' });
