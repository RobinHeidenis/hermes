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
[![Lucia](https://img.shields.io/badge/Lucia-%237357ff.svg?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAIAAABvFaqvAAAB/klEQVR4nKzV/08ScRjA8fdRydKt5UZrUa3YapW1lRXVMv0/8webrdr6A1y/tFlyiOjGFw+RElxEX0iMizOyyX1pz3FDmjJBvH3GnufD3YuHz91zn+OO43AUh+/AM2rb6H+OAprPo+b7hmyI5Ih8wLb7g7Kf2dTRa2il/qA5DUwUk/fZPqCqgZYXRTFZ+UTFOCw0r+E0uDDM5QA0UFcOBdk20YTUMnGL8ZtgEctgWb1DmY/UdPw+HowQvsbgMQyDVKF3SF2SZQ7f4KQf/wAPr0uqpnuEqjqrWfd/3fNmJkYlzRWo6L1AakyWORTkYtCbCZ7hynkpai7RNWSaLETlmrGwpGvr5NwWGXeLWkjQMLuDtDRbOoMnuHuHapWpaZ69YPMnoyMMDVDfIrnfw7kPFH0nvxx2V2dykt+/qNd4OiX3/tFt+UqNdwFVyqxl5OzHT3g5zbei2yIW5a88f8XYfYkL63zfOAiKzaI0CIVYTZOOe42GO7QUySRXL8lMdE9R/0Fmg6VZeYiHTzPz2lNaA5M3M5wakmBxkZ2dztBynLqB4qDF5fZ7tVhe0Pxcdvtm2yCR6gzF30ruA9sUTog2pRlYf71AjXSAyiWKOQ9qDcVuU6xdTjEpFii1ve2U1i6ib/DjiwStXaV9e3EUUJpX7AZnzxEI7IH6PP4FAAD//95W9ZuRzsYBAAAAAElFTkSuQmCC)](https://lucia-auth.com)

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