# Todo App

This app implements following features:
- Persistence layer integration
- Task completion and removal
- Multiple todo list creation
- Todo list access via unique url
- Displaying and switching between all owner's task list 
- Subtasks and subtask completion progress
- Multiple user simultaneous task editing
- Minimalistic login/logout
- Collaboration tracking
- Infinite task nesting
- Task list freeze/unfreeze options for task list owner
- Optimistic api approach

## Try Out
[https://dn-ui-todos.vercel.app](https://dn-ui-todos.vercel.app)
- Use "Alice" name to access predefined task lists

## Stack
- Typescript
- React / Next.js
- Node / Next.js
- Tailwind and Shadcn for UI component
- Lucide icons
- Axios for data fetching
- SWR for ui level data caching
- Redis for persistence
- Vercel for CI

## Notes
- I was running out of time and didn't connect it to Postgre DB, instead I've used nosql storage;
- Sorry for junk code, since I was focused on quantity over quality, within the given time frame;
- I've cut edges on unimportant stuff yet still maintained separation between core aspects of an app;

## Known issues
- Task collaboration indication doesnt properly propagate from subtasks

## Things to improve
- add debounce to updating data
- implement BE data validation
