<div align="center">
    <a href="https://hermes.fractum.nl">
        <img src="public/logo.png" alt="Logo" width="80" height="80">
    </a>
    <h1>Hermes</h1>
    <p><i>Shopping list and expenses tracker*</i></p>
    <p><sup>*Expenses tracker not included (coming soon™️)</sup></p>
</div>

<!-- TOC -->
<details>
    <summary>Table of Contents</summary>
    <ol>
        <li>
          <a href="#features">Features</a>
        </li>
        <li>
          <a href="#technologies">Technologies</a>
          <ul>
            <li><a href="#language">Language</a></li>
            <li><a href="#framework">Framework</a></li>
            <li><a href="#styling--components">Styling & Components</a></li>
            <li><a href="#secured-by">Secured by</a></li>
            <li><a href="#database">Database</a></li>
            <li><a href="#hosted-on">Hosted on</a></li>
          </ul>
        </li>
        <li>
          <a href="#screenshots">Screenshots</a>
          <ul>
            <li><a href="#workspaces">Workspaces</a></li>
            <li><a href="#workspace-overview">Workspace overview</a></li>
            <li><a href="#lists">Lists</a></li>
            <li><a href="#invites">Invites</a></li>
            <li><a href="#profile">Profile</a></li>
            <li><a href="#view-transitions">View transitions</a></li>
          </ul>
        </li>
      </ol>
</details>
<!-- TOC -->

## About the project

Hermes is a shopping list app that allows you to create different workspaces for different households. You can then
create multiple lists inside these workspaces. This allows you to have a list for your weekly groceries, and a list for
your monthly groceries, for example.

It was created as a successor to my [other shopping list app](https://github.com/robinheidenis/shoppinglist), which in
turn is a successor for the first ever real project I did together with my brother.

My goal for the project is to create a fully functional, production-ready app that I can use in my daily life.
I also wanted to focus on the UX of the app, which is why I spent a lot of time on user flows and little niceties within
the app.

## Features

- [x] Different workspaces for different households
- [x] Multiple lists per workspace
- [x] Join workspaces with an invite code
- [x] Loyalty cards
- [x] Dark mode
- [x] Swipe to check and delete items
- [x] Cutting edge new features (View transitions)
- [ ] Expenses tracker
- [ ] Bugs (hopefully)

## Technologies

Created using
the [![T3 Stack](https://img.shields.io/badge/Stack-%23000.svg?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU4IiBoZWlnaHQ9IjE5OSIgdmlld0JveD0iMCAwIDI1OCAxOTkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTY1LjczNSAyNS4wNzAxTDE4OC45NDcgMC45NzI0MTJIMC40NjU5OTRWMjUuMDcwMUgxNjUuNzM1WiIgZmlsbD0iI2UyZThmMCIvPgo8cGF0aCBkPSJNMTYzLjk4MSA5Ni4zMjM5TDI1NC4wMjIgMy42ODMxNEwyMjEuMjA2IDMuNjgyOTVMMTQ1LjYxNyA4MC43NjA5TDE2My45ODEgOTYuMzIzOVoiIGZpbGw9IiNlMmU4ZjAiLz4KPHBhdGggZD0iTTIzMy42NTggMTMxLjQxOEMyMzMuNjU4IDE1NS4wNzUgMjE0LjQ4IDE3NC4yNTQgMTkwLjgyMyAxNzQuMjU0QzE3MS43MTUgMTc0LjI1NCAxNTUuNTEzIDE2MS43MzggMTUwIDE0NC40MzlMMTQ2LjYyNSAxMzMuODQ4TDEyNy4zMjkgMTUzLjE0M0wxMjkuMDkyIDE1Ny4zMzZDMTM5LjIxNSAxODEuNDIxIDE2My4wMzQgMTk4LjM1NCAxOTAuODIzIDE5OC4zNTRDMjI3Ljc5MSAxOTguMzU0IDI1Ny43NTkgMTY4LjM4NiAyNTcuNzU5IDEzMS40MThDMjU3Ljc1OSAxMDYuOTM3IDI0NC4zOTkgODUuNzM5NiAyMjQuOTU2IDc0LjA5MDVMMjIwLjM5NSA3MS4zNTgyTDIwMi43MjcgODkuMjUyOEwyMTAuNzg4IDkzLjUwODNDMjI0LjQwMyAxMDAuNjk2IDIzMy42NTggMTE0Ljk4MSAyMzMuNjU4IDEzMS40MThaIiBmaWxsPSIjZTJlOGYwIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNODguMjYyNSAxOTIuNjY5TDg4LjI2MjYgNDUuNjQ1OUg2NC4xNjQ4TDY0LjE2NDggMTkyLjY2OUg4OC4yNjI1WiIgZmlsbD0iI2UyZThmMCIvPgo8L3N2Zz4K)](https://create.t3.gg/)

The project uses the following technologies:

#### Language:

[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)

#### Framework:

[![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/) <br />
[![tRPC](https://img.shields.io/badge/tRPC-%232596BE?style=for-the-badge&logo=trpc&logoColor=white)](https://trpc.io) <br />
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev)

#### Styling & Components:

[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com) <br/>
[![Mantine](https://img.shields.io/badge/mantine-%23339AF0.svg?style=for-the-badge&logo=mantine&logoColor=white)](https://mantine.dev)

#### Secured by:

Currently: <br/>
[![Lucia](https://img.shields.io/badge/Lucia-%237357ff.svg?style=for-the-badge&logo=data:image/png;base64,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)](https://lucia-auth.com)

Previously: <br/>
[![Auth0](https://img.shields.io/badge/Auth0-%23EB5424.svg?style=for-the-badge&logo=auth0&logoColor=white)](https://auth0.com/)

#### Database:

[![Neon](https://img.shields.io/badge/Neon%20(postgresql)-%234169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech) <br />
[![Drizzle](https://img.shields.io/badge/Drizzle%20(ORM)-%23000.svg?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjkuNjMxMzkiIGhlaWdodD0iNDAuODUxNiIgcng9IjQuODE1NyIgdHJhbnNmb3JtPSJtYXRyaXgoMC44NzMwMjggMC40ODc2NyAtMC40OTcyMTIgMC44Njc2MjkgNDMuNDgwNSA2Ny4zMDM3KSIgZmlsbD0id2hpdGUiPjwvcmVjdD48cmVjdCB3aWR0aD0iOS42MzEzOSIgaGVpZ2h0PSI0MC44NTE2IiByeD0iNC44MTU3IiB0cmFuc2Zvcm09Im1hdHJpeCgwLjg3MzAyOCAwLjQ4NzY3IC0wLjQ5NzIxMiAwLjg2NzYyOSA3Ni45Mzk1IDQ2LjUzNDIpIiBmaWxsPSJ3aGl0ZSI+PC9yZWN0PjxyZWN0IHdpZHRoPSI5LjYzMTM5IiBoZWlnaHQ9IjQwLjg1MTYiIHJ4PSI0LjgxNTciIHRyYW5zZm9ybT0ibWF0cml4KDAuODczMDI4IDAuNDg3NjcgLTAuNDk3MjEyIDAuODY3NjI5IDEyOC40MjQgNDYuNTM1MikiIGZpbGw9IndoaXRlIj48L3JlY3Q+PHJlY3Qgd2lkdGg9IjkuNjMxMzkiIGhlaWdodD0iNDAuODUxNiIgcng9IjQuODE1NyIgdHJhbnNmb3JtPSJtYXRyaXgoMC44NzMwMjggMC40ODc2NyAtMC40OTcyMTIgMC44Njc2MjkgOTQuOTU3IDY3LjMwMzcpIiBmaWxsPSJ3aGl0ZSI+PC9yZWN0Pjwvc3ZnPg==)](https://orm.drizzle.team/)

#### Hosted On:

[![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

## Screenshots

### Workspaces

![workspaces.png](screenshots/workspaces.png)

You can have different workspaces for different households. There is a clear distinction between workspaces you own and
workspaces you are a member of.

### Workspace overview

![workspace-overview.png](screenshots/workspace-overview.png)

Inside your workspace you can see all of your lists. You can also see your loyalty cards and the members of the
workspace.

![workspace-settings.png](screenshots/workspace-settings.png)

Clicking on the gear icon in the top right opens the workspace settings modal. This is one I'm particularly proud of. It
allows you to change the workspace name, delete it, set a default list, kick collaborators, and copy, delete, and
refresh the invite code.

### Lists

![list.png](screenshots/list.png)

On the list page you can make your shopping list. Items can be added through the FAB (floating action button). This
opens a modal where you can enter the name, price, amount, and URL of the item. URL's can be used to clarify which type
of cookies you mean specifically.

![swipe-actions.gif](screenshots/swipe-actions.gif)

Items can be checked off by swiping. The same thing goes for unchecking and deleting items.

![loyalty-card.gif](screenshots/loyalty-card.gif)

> Featuring mobile-like animations!

The loyalty card button is used to show your default loyalty card for this list. This is useful when you're in the
store, since you don't have to switch to a different app to scan your loyalty card.
The modal can be closed using the browser's (or your phone's) back button (Which took me a whole night to get working
properly).

![list-menu.png](screenshots/list-menu.png)

The list menu can be opened by clicking the three dots in the top right. This menu allows you to access the list
settings, delete checked items, and delete all items.

It also allows you to turn on Reordering mode.
![reordering.gif](screenshots/reordering.gif)

### Invites

![invite.png](screenshots/invite.png)

Invites allow other users to join your workspace. The code / link can be found in the workspace settings modal.
Users that click your link are treated with the above screen. Clicking `Accept invite` adds them to the workspace, and
redirects them to the workspace overview.

### Profile

![profile.png](screenshots/profile.png)

Finally, we have the profile page. This page shows your name, email, and profile picture.
It allows you to change your username (if you've logged in with Discord), and your email (if you signed up with
email/password).
Updating your profile here will also update it in Auth0.

### View transitions

![view-transitions.gif](screenshots/view-transitions.gif)

Hermes uses a brand-new API called view transitions to make page transitions look better. It animates a fade from the
previous page to the next page, and animates the movement of certain elements like the workspace title.

> [!Note]
> This currently only works in Google Chrome (and Chromium based browsers like Edge), and not in Firefox.