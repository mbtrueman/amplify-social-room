import { util, extensions } from '@aws-appsync/utils'
export const request = () => ({});

export const response = (ctx) => {
	console.log('ctx', ctx);
	const filter = {
		roomId: { eq: ctx.arguments.roomId },
		username: { ne: ctx.arguments.myUsername }
	}
	extensions.setSubscriptionFilter(util.transform.toSubscriptionFilter(filter))
	return null;
}