# meteor-auth-demo

Provides a plug-and-play auth component to connect and communicate with three different dataverse-kernel providers: Dataverse-Snap(running in MetaMask Snap), Meteor-Wallet(running in Meteor extension), and Meteor-Web(running in embedded iframe).

## Quick-Start

### requirements

- [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) -
  A cryptocurrency wallet browser extension.
- [Node.js](https://nodejs.org/en/) version >= 16.
- [pnpm](https://pnpm.io/) version >= 7.

```bash
pnpm install
pnpm dev
```

the demo will be running on http://localhost:3000/.

**attentions:**
1. Dataverse Snap is still in the testing phase, you need to use Metamask flask and run the [snap server](https://github.com/dataverse-os/dataverse-snap) locally before using it.
2. You may need to pre-install the Meteor-Wallet browser extension before using it. Only MetaMask stable is available, you need to disable MetaMask flask.